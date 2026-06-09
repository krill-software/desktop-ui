/** Wire a list of menu definitions into a menu-bar container.
 *  The container is typically the `<nav id="menu-bar">` inside the titlebar. */
export function installMenuBar(container, menus) {
    let open = null;
    const closeOpen = () => {
        if (!open)
            return;
        open.dropdown.remove();
        delete open.trigger.dataset.open;
        open = null;
    };
    const openAt = (menu, trigger) => {
        closeOpen();
        const dropdown = renderDropdown(menu, closeOpen);
        document.body.appendChild(dropdown);
        const rect = trigger.getBoundingClientRect();
        dropdown.style.left = `${Math.round(rect.left)}px`;
        dropdown.style.top = `${Math.round(rect.bottom)}px`;
        trigger.dataset.open = "true";
        open = { menu, trigger, dropdown };
    };
    for (const menu of menus) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "menu-trigger";
        btn.textContent = menu.label;
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (open && open.menu === menu)
                closeOpen();
            else
                openAt(menu, btn);
        });
        btn.addEventListener("mouseenter", () => {
            if (open && open.menu !== menu)
                openAt(menu, btn);
        });
        container.appendChild(btn);
    }
    document.addEventListener("mousedown", (e) => {
        if (!open)
            return;
        const target = e.target;
        if (target && (open.dropdown.contains(target) || open.trigger.contains(target)))
            return;
        closeOpen();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && open)
            closeOpen();
    });
}
/** Wire a single hamburger button to a popover holding every menu's items,
 *  groups separated by a rule. Used by the app layout (`layout: "app"`),
 *  where there's no horizontal menu bar — the menus live behind one button
 *  in the aux strip. Reuses the same `.menu-dropdown` rendering as the bar.
 *
 *  `aboutLine` (e.g. "File Drop 0.1.0") renders as a static line at the very
 *  top — the app layout has no status line / titlebar, so this is the app's
 *  one version surface. */
export function installHamburgerMenu(button, menus, aboutLine) {
    const merged = { label: "", items: [] };
    if (aboutLine)
        merged.items.push({ label: aboutLine, static: true });
    menus.forEach((menu) => {
        if (merged.items.length > 0)
            merged.items.push({ sep: true });
        merged.items.push(...menu.items);
    });
    let dropdown = null;
    const close = () => {
        if (!dropdown)
            return;
        dropdown.remove();
        delete button.dataset.open;
        dropdown = null;
    };
    button.addEventListener("click", (e) => {
        e.stopPropagation();
        if (dropdown) {
            close();
            return;
        }
        dropdown = renderDropdown(merged, close);
        document.body.appendChild(dropdown);
        const rect = button.getBoundingClientRect();
        dropdown.style.left = `${Math.round(rect.left)}px`;
        dropdown.style.top = `${Math.round(rect.bottom)}px`;
        button.dataset.open = "true";
    });
    document.addEventListener("mousedown", (e) => {
        if (!dropdown)
            return;
        const target = e.target;
        if (target && (dropdown.contains(target) || button.contains(target)))
            return;
        close();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape")
            close();
    });
}
function renderDropdown(menu, onClose) {
    const drop = document.createElement("div");
    drop.className = "menu-dropdown";
    drop.addEventListener("mousedown", (e) => e.stopPropagation());
    for (const item of menu.items) {
        if ("sep" in item) {
            const sep = document.createElement("div");
            sep.className = "menu-separator";
            drop.appendChild(sep);
            continue;
        }
        if ("static" in item) {
            const line = document.createElement("div");
            line.className = "menu-item-static";
            line.textContent = item.label;
            drop.appendChild(line);
            continue;
        }
        const row = document.createElement("button");
        row.type = "button";
        row.className = "menu-item";
        const label = document.createElement("span");
        label.className = "menu-item-label";
        label.textContent = item.label;
        row.appendChild(label);
        if (item.shortcut) {
            const sc = document.createElement("span");
            sc.className = "menu-item-shortcut";
            sc.textContent = item.shortcut;
            row.appendChild(sc);
        }
        row.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
            item.action();
        });
        drop.appendChild(row);
    }
    return drop;
}
//# sourceMappingURL=menu.js.map