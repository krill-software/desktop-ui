import { buildTitlebar } from "./titlebar.js";
import { installMenuBar } from "./menu.js";
import { ACTION_REGISTRY, GROUP_LABEL, GROUP_ORDER, MENU_LAYOUT, shouldDeferToText, } from "./actions.js";
import { isTextTarget, matchShortcut, parseShortcut } from "./keybindings.js";
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
    const { titlebar, title, menuBar } = buildTitlebar();
    parent.appendChild(titlebar);
    const viewport = document.createElement("main");
    viewport.id = "viewport";
    parent.appendChild(viewport);
    let statusLine = null;
    if (opts.showStatusLine) {
        statusLine = document.createElement("footer");
        statusLine.id = "status-line";
        statusLine.setAttribute("aria-live", "polite");
        parent.appendChild(statusLine);
    }
    title.textContent = opts.productName;
    // Effective actions: app-provided + auto-included universals.
    const actions = resolveActions(opts.actions ?? {});
    const menus = buildMenus(actions, opts.customMenu ?? []);
    if (menus.length > 0)
        installMenuBar(menuBar, menus);
    installShortcutHandler(actions, opts.customMenu ?? [], opts.bindings ?? {});
    return { title, menuBar, statusLine, viewport };
}
/** Auto-include `close-window` and `quit` with their package defaults if
 *  the app didn't provide callbacks. Every krill app gets them. */
function resolveActions(appActions) {
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
    return out;
}
function buildMenus(actions, customMenu) {
    const menus = [];
    for (const group of GROUP_ORDER) {
        const items = [];
        let pendingSep = false;
        // Canonical actions in canonical order, separators between sub-groups.
        for (const slot of MENU_LAYOUT[group]) {
            if (slot === "sep") {
                if (items.length > 0)
                    pendingSep = true;
                continue;
            }
            const cb = actions[slot];
            if (typeof cb !== "function")
                continue;
            if (pendingSep) {
                items.push({ sep: true });
                pendingSep = false;
            }
            const meta = ACTION_REGISTRY[slot];
            items.push({ label: meta.label, shortcut: meta.shortcut, action: cb });
        }
        // App-specific items appended at the end with a separator before them.
        const customForGroup = customMenu
            .filter(c => c.group === group)
            .flatMap(c => c.items);
        if (customForGroup.length > 0) {
            if (items.length > 0)
                items.push({ sep: true });
            for (const ci of customForGroup)
                items.push(ci);
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
        if (!meta)
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