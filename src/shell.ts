import { buildTitlebar } from "./titlebar.js";
import { installMenuBar } from "./menu.js";
import {
  ACTION_REGISTRY,
  GROUP_LABEL,
  GROUP_ORDER,
  MENU_LAYOUT,
  shouldDeferToText,
} from "./actions.js";
import { isTextTarget, matchShortcut, parseShortcut, type ParsedShortcut } from "./keybindings.js";
import { checkForUpdates } from "./updater.js";
import type {
  ActionCallback,
  ActionId,
  ChromeRefs,
  CustomMenuExtension,
  MenuDef,
  MenuItem,
  MountChromeOptions,
} from "./types.js";

/** Build and mount the standard krill app chrome — titlebar, menu bar,
 *  optional status line, viewport. Returns refs the app uses to populate
 *  dynamic content (filename, status indicators) and to render its
 *  working view (`viewport`).
 *
 *  The menu bar and keyboard shortcuts are derived from the `actions`
 *  map (canonical actions with package-owned label / shortcut / group)
 *  and `customMenu` (app-specific extras). `bindings` adds shortcuts
 *  that don't surface as menu entries. */
export function mountChrome(opts: MountChromeOptions): ChromeRefs {
  const parent = opts.parent ?? document.body;
  parent.replaceChildren();

  const { titlebar, title, menuBar } = buildTitlebar();
  parent.appendChild(titlebar);

  // Optional AUX pane on the LEFT (tools / nav / settings / output panels).
  // The body grid switches templates based on body[data-aux] — see palette.css.
  let aux: HTMLElement | null = null;
  if (opts.showAuxPane) {
    aux = document.createElement("aside");
    aux.id = "aux";
    parent.appendChild(aux);
    document.body.dataset.aux = "visible";
  } else {
    delete document.body.dataset.aux;
  }

  const viewport = document.createElement("main");
  viewport.id = "viewport";
  parent.appendChild(viewport);

  let statusLine: HTMLElement | null = null;
  let statusInfo: HTMLElement | null = null;
  let statusState: HTMLElement | null = null;
  if (opts.showStatusLine) {
    statusLine = document.createElement("footer");
    statusLine.id = "status-line";
    statusLine.setAttribute("aria-live", "polite");

    statusInfo = document.createElement("div");
    statusInfo.id = "status-info";
    statusLine.appendChild(statusInfo);

    statusState = document.createElement("div");
    statusState.id = "status-state";
    statusLine.appendChild(statusState);

    parent.appendChild(statusLine);
  }

  // Titlebar starts empty — the centered title shows the active filename
  // when one is open, nothing otherwise. Apps set chrome.title.textContent
  // explicitly on file load and clear it on close.
  title.textContent = "";

  // Effective actions: app-provided + auto-included universals.
  const actions = resolveActions(opts.actions ?? {}, opts);

  const menus = buildMenus(actions, opts.customMenu ?? []);
  if (menus.length > 0) installMenuBar(menuBar, menus);

  installShortcutHandler(actions, opts.customMenu ?? [], opts.bindings ?? {});

  return { title, menuBar, viewport, aux, statusLine, statusInfo, statusState };
}

/** Auto-include `close-window` and `quit` with their package defaults if
 *  the app didn't provide callbacks. Every krill app gets them. When
 *  `opts.updater` is true, also auto-include the "Check for updates…"
 *  entry wired to the package's updater helper. */
function resolveActions(
  appActions: Partial<Record<ActionId, ActionCallback | undefined>>,
  opts: MountChromeOptions,
): Partial<Record<ActionId, ActionCallback>> {
  const out: Partial<Record<ActionId, ActionCallback>> = {};
  for (const id of Object.keys(appActions) as ActionId[]) {
    const cb = appActions[id];
    if (typeof cb === "function") out[id] = cb;
  }
  for (const id of ["close-window", "quit"] as const) {
    if (typeof out[id] !== "function") {
      const def = ACTION_REGISTRY[id].default;
      if (def) out[id] = def;
    }
  }
  if (opts.updater && typeof out["check-for-updates"] !== "function") {
    out["check-for-updates"] = () => checkForUpdates(opts.productName);
  }
  return out;
}

function buildMenus(
  actions: Partial<Record<ActionId, ActionCallback>>,
  customMenu: CustomMenuExtension[],
): MenuDef[] {
  const menus: MenuDef[] = [];

  for (const group of GROUP_ORDER) {
    const customForGroup = customMenu
      .filter(c => c.group === group)
      .flatMap(c => c.items);

    const items: MenuItem[] = [];
    let pendingSep = false;
    const emit = (it: MenuItem) => {
      if (pendingSep && items.length > 0) {
        items.push({ sep: true });
      }
      pendingSep = false;
      items.push(it);
    };

    for (const slot of MENU_LAYOUT[group]) {
      if (slot === "sep") {
        if (items.length > 0) pendingSep = true;
        continue;
      }
      if (slot === "custom") {
        for (const ci of customForGroup) emit(ci);
        continue;
      }
      const cb = actions[slot];
      if (typeof cb !== "function") continue;
      const meta = ACTION_REGISTRY[slot];
      emit({ label: meta.label, shortcut: meta.shortcut, action: cb });
    }

    if (items.length > 0) {
      menus.push({ label: GROUP_LABEL[group], items });
    }
  }

  return menus;
}

interface Binding {
  parsed: ParsedShortcut;
  cb: ActionCallback;
  /** When true, skip the binding if focus is in a text input — let the
   *  browser handle the key natively (e.g., undo inside a textarea). */
  deferText: boolean;
}

function installShortcutHandler(
  actions: Partial<Record<ActionId, ActionCallback>>,
  customMenu: CustomMenuExtension[],
  bindings: Record<string, ActionCallback>,
): void {
  const list: Binding[] = [];

  for (const id of Object.keys(actions) as ActionId[]) {
    const cb = actions[id];
    if (typeof cb !== "function") continue;
    const meta = ACTION_REGISTRY[id];
    if (!meta || !meta.shortcut) continue;
    const parsed = parseShortcut(meta.shortcut);
    list.push({
      parsed,
      cb,
      // Edit-group actions defer to native handling in text fields, and
      // any plain-key shortcut (no Ctrl/Meta) defers too — we don't want
      // to swallow letters or arrows while the user is typing.
      deferText: shouldDeferToText(id) || !parsed.mod,
    });
  }

  for (const ext of customMenu) {
    for (const item of ext.items) {
      if ("sep" in item) continue;
      if (!item.shortcut) continue;
      const parsed = parseShortcut(item.shortcut);
      list.push({
        parsed,
        cb: item.action,
        deferText: !parsed.mod,
      });
    }
  }

  for (const [shortcut, cb] of Object.entries(bindings)) {
    const parsed = parseShortcut(shortcut);
    list.push({ parsed, cb, deferText: !parsed.mod });
  }

  if (list.length === 0) return;

  window.addEventListener("keydown", (e) => {
    for (const b of list) {
      if (!matchShortcut(e, b.parsed)) continue;
      if (b.deferText && isTextTarget(e.target)) continue;
      e.preventDefault();
      void b.cb();
      return;
    }
  }, { capture: true });
}
