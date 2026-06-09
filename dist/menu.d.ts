import type { MenuDef } from "./types.js";
/** Wire a list of menu definitions into a menu-bar container.
 *  The container is typically the `<nav id="menu-bar">` inside the titlebar. */
export declare function installMenuBar(container: HTMLElement, menus: MenuDef[]): void;
/** Wire a single hamburger button to a popover holding every menu's items,
 *  groups separated by a rule. Used by the app layout (`layout: "app"`),
 *  where there's no horizontal menu bar — the menus live behind one button
 *  in the aux strip. Reuses the same `.menu-dropdown` rendering as the bar.
 *
 *  `aboutLine` (e.g. "File Drop 0.1.0") renders as a static line at the very
 *  top — the app layout has no status line / titlebar, so this is the app's
 *  one version surface. */
export declare function installHamburgerMenu(button: HTMLElement, menus: MenuDef[], aboutLine?: string): void;
//# sourceMappingURL=menu.d.ts.map