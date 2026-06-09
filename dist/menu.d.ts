import type { MenuDef } from "./types.js";
/** Wire a list of menu definitions into a menu-bar container.
 *  The container is typically the `<nav id="menu-bar">` inside the titlebar. */
export declare function installMenuBar(container: HTMLElement, menus: MenuDef[]): void;
/** Wire a single hamburger button to a popover holding every menu's items,
 *  groups separated by a rule. Used by the app layout (`layout: "app"`),
 *  where there's no horizontal menu bar — the menus live behind one button
 *  in the aux strip. Reuses the same `.menu-dropdown` rendering as the bar. */
export declare function installHamburgerMenu(button: HTMLElement, menus: MenuDef[]): void;
//# sourceMappingURL=menu.d.ts.map