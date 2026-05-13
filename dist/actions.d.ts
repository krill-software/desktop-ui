import type { ActionId, MenuGroup } from "./types.js";
export interface ActionDef {
    label: string;
    /** Optional. Actions without a shortcut only appear in menus, never as
     *  keyboard bindings (e.g. "Check for updates…"). */
    shortcut?: string;
    group: MenuGroup;
    /** Default callback for actions with a sensible package-level default
     *  (close-window, quit, check-for-updates). Apps may override via the
     *  `actions` option. */
    default?: () => void | Promise<void>;
}
/** Single source of truth for the label, shortcut, and menu group of every
 *  canonical action in the krill umbrella. Adding to this is a deliberate act:
 *  it changes the contract that every krill app shares. */
export declare const ACTION_REGISTRY: Record<ActionId, ActionDef>;
/** Canonical layout per group.
 *  - `"sep"` becomes a menu separator IFF visible items exist on both sides.
 *  - `"custom"` is the slot where customMenu items for this group land.
 *    When a group has both canonical actions and customs, surrounding
 *    separators auto-collapse if either side is empty. */
export declare const MENU_LAYOUT: Record<MenuGroup, (ActionId | "sep" | "custom")[]>;
export declare const GROUP_LABEL: Record<MenuGroup, string>;
/** Order menus appear in the menu bar. */
export declare const GROUP_ORDER: MenuGroup[];
export declare function shouldDeferToText(id: ActionId): boolean;
//# sourceMappingURL=actions.d.ts.map