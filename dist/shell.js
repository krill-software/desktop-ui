import { buildTitlebar } from "./titlebar.js";
import { installMenuBar, installHamburgerMenu } from "./menu.js";
import { buildMainTopbar, buildAuxTopbar } from "./topbar.js";
import { ACTION_REGISTRY, GROUP_LABEL, GROUP_ORDER, MENU_LAYOUT, shouldDeferToText, } from "./actions.js";
import { isTextTarget, matchShortcut, parseShortcut } from "./keybindings.js";
import { checkForUpdates } from "./updater.js";
/** Build and mount the standard krill app chrome — titlebar, menu bar,
 *  optional status line, viewport. Returns refs the app uses to populate
 *  dynamic content (filename, status indicators) and to render its
 *  working view (`viewport`).
 *
 *  The menu bar and keyboard shortcuts are derived from the `actions`
 *  map (canonical actions with package-owned label / shortcut / group)
 *  and `customMenu` (app-specific extras). `bindings` adds shortcuts
 *  that don't surface as menu entries. */
export function mountChrome(opts) {
    const parent = opts.parent ?? document.body;
    parent.replaceChildren();
    const isApp = opts.layout === "app";
    // Title + menu-bar refs. The app layout has no titlebar, so these are
    // detached placeholders — kept non-null to preserve ChromeRefs' shape;
    // app-layout apps don't read them.
    let title;
    let menuBar;
    if (isApp) {
        title = document.createElement("span");
        menuBar = document.createElement("nav");
        document.body.dataset.layout = "app";
    }
    else {
        const tb = buildTitlebar();
        parent.appendChild(tb.titlebar);
        title = tb.title;
        menuBar = tb.menuBar;
        document.body.dataset.layout = "document";
    }
    // Optional AUX pane on the LEFT (tools / nav / settings / output panels).
    // The body grid switches templates based on body[data-aux] — see palette.css.
    // In the app layout the aux pane leads with a strip carrying the hamburger.
    let aux = null;
    let hamburger = null;
    if (opts.showAuxPane) {
        aux = document.createElement("aside");
        aux.id = "aux";
        if (isApp) {
            const at = buildAuxTopbar();
            aux.appendChild(at.auxTopbar);
            hamburger = at.hamburger;
        }
        parent.appendChild(aux);
        document.body.dataset.aux = "visible";
    }
    else {
        delete document.body.dataset.aux;
    }
    const viewport = document.createElement("main");
    viewport.id = "viewport";
    parent.appendChild(viewport);
    // App layout: the main pane carries its own top strip (window controls)
    // and a scrollable content area. Apps render into `mainContent`.
    let mainContent = null;
    if (isApp) {
        const mainTopbar = buildMainTopbar();
        mainContent = document.createElement("div");
        mainContent.className = "main-content";
        // No aux pane → host the hamburger at the left of the main strip.
        if (!opts.showAuxPane) {
            const at = buildAuxTopbar();
            hamburger = at.hamburger;
            hamburger.style.marginRight = "auto";
            mainTopbar.prepend(hamburger);
        }
        viewport.append(mainTopbar, mainContent);
    }
    let statusLine = null;
    let statusInfo = null;
    let statusState = null;
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
    const versionLine = opts.version
        ? `${opts.productName} ${opts.version}`
        : undefined;
    const menus = buildMenus(actions, opts.customMenu ?? [], versionLine);
    if (menus.length > 0) {
        if (isApp && hamburger)
            installHamburgerMenu(hamburger, menus);
        else
            installMenuBar(menuBar, menus);
    }
    installShortcutHandler(actions, opts.customMenu ?? [], opts.bindings ?? {});
    return { title, menuBar, viewport, mainContent, aux, statusLine, statusInfo, statusState };
}
/** Auto-include `close-window` and `quit` with their package defaults if
 *  the app didn't provide callbacks. Every krill app gets them. When
 *  `opts.updater` is true, also auto-include the "Check for updates…"
 *  entry wired to the package's updater helper. */
function resolveActions(appActions, opts) {
    const out = {};
    for (const id of Object.keys(appActions)) {
        const cb = appActions[id];
        if (typeof cb === "function")
            out[id] = cb;
    }
    for (const id of ["close-window", "quit"]) {
        if (typeof out[id] !== "function") {
            const def = ACTION_REGISTRY[id].default;
            if (def)
                out[id] = def;
        }
    }
    if (opts.updater && typeof out["check-for-updates"] !== "function") {
        out["check-for-updates"] = () => checkForUpdates(opts.productName);
    }
    return out;
}
function buildMenus(actions, customMenu, versionLine) {
    const menus = [];
    for (const group of GROUP_ORDER) {
        const customForGroup = customMenu
            .filter(c => c.group === group)
            .flatMap(c => c.items);
        const items = [];
        let pendingSep = false;
        const emit = (it) => {
            if (pendingSep && items.length > 0) {
                items.push({ sep: true });
            }
            pendingSep = false;
            items.push(it);
        };
        // The Help menu opens with a static "<productName> <version>" line.
        // A separator follows it (pendingSep) so it sits visually apart from
        // the actions below.
        if (group === "help" && versionLine) {
            items.push({ label: versionLine, static: true });
            pendingSep = true;
        }
        for (const slot of MENU_LAYOUT[group]) {
            if (slot === "sep") {
                if (items.length > 0)
                    pendingSep = true;
                continue;
            }
            if (slot === "custom") {
                for (const ci of customForGroup)
                    emit(ci);
                continue;
            }
            const cb = actions[slot];
            if (typeof cb !== "function")
                continue;
            const meta = ACTION_REGISTRY[slot];
            emit({ label: meta.label, shortcut: meta.shortcut, action: cb });
        }
        if (items.length > 0) {
            menus.push({ label: GROUP_LABEL[group], items });
        }
    }
    return menus;
}
function installShortcutHandler(actions, customMenu, bindings) {
    const list = [];
    for (const id of Object.keys(actions)) {
        const cb = actions[id];
        if (typeof cb !== "function")
            continue;
        const meta = ACTION_REGISTRY[id];
        if (!meta || !meta.shortcut)
            continue;
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
            if ("sep" in item)
                continue;
            if (!item.shortcut)
                continue;
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
    if (list.length === 0)
        return;
    window.addEventListener("keydown", (e) => {
        for (const b of list) {
            if (!matchShortcut(e, b.parsed))
                continue;
            if (b.deferText && isTextTarget(e.target))
                continue;
            e.preventDefault();
            void b.cb();
            return;
        }
    }, { capture: true });
}
//# sourceMappingURL=shell.js.map