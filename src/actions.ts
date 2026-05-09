import { getCurrentWindow } from "@tauri-apps/api/window";
import type { ActionId, MenuGroup } from "./types.js";

export interface ActionDef {
  label: string;
  shortcut: string;
  group: MenuGroup;
  /** Default callback for actions with a sensible package-level default
   *  (close-window, quit). Apps may override via the `actions` option. */
  default?: () => void | Promise<void>;
}

/** Single source of truth for the label, shortcut, and menu group of every
 *  canonical action in the krill umbrella. Adding to this is a deliberate act:
 *  it changes the contract that every krill app shares. */
export const ACTION_REGISTRY: Record<ActionId, ActionDef> = {
  // File
  "new":          { label: "New",          shortcut: "Ctrl+N",       group: "file" },
  "open":         { label: "Open…",        shortcut: "Ctrl+O",       group: "file" },
  "save":         { label: "Save",         shortcut: "Ctrl+S",       group: "file" },
  "save-as":      { label: "Save As…",     shortcut: "Ctrl+Shift+S", group: "file" },
  "close-window": { label: "Close window", shortcut: "Ctrl+W",       group: "file",
                    default: () => void getCurrentWindow().close() },
  "quit":         { label: "Quit",         shortcut: "Ctrl+Q",       group: "file",
                    default: () => void getCurrentWindow().close() },
  // Edit
  "undo":         { label: "Undo",         shortcut: "Ctrl+Z",       group: "edit" },
  "redo":         { label: "Redo",         shortcut: "Ctrl+Shift+Z", group: "edit" },
  "cut":          { label: "Cut",          shortcut: "Ctrl+X",       group: "edit" },
  "copy":         { label: "Copy",         shortcut: "Ctrl+C",       group: "edit" },
  "paste":        { label: "Paste",        shortcut: "Ctrl+V",       group: "edit" },
  "select-all":   { label: "Select all",   shortcut: "Ctrl+A",       group: "edit" },
  // View
  "zoom-in":      { label: "Zoom in",       shortcut: "Ctrl+=",  group: "view" },
  "zoom-out":     { label: "Zoom out",      shortcut: "Ctrl+-",  group: "view" },
  "zoom-fit":     { label: "Fit to window", shortcut: "Ctrl+0",  group: "view" },
  "zoom-actual":  { label: "Original size", shortcut: "Ctrl+1",  group: "view" },
  "fullscreen":   { label: "Fullscreen",    shortcut: "F",       group: "view" },
  "toggle-sidebar":{ label: "Toggle sidebar", shortcut: "Ctrl+\\", group: "view" },
  // Go
  "previous":     { label: "Previous",     shortcut: "ArrowLeft",  group: "go" },
  "next":         { label: "Next",         shortcut: "ArrowRight", group: "go" },
  "first":        { label: "First",        shortcut: "Home",       group: "go" },
  "last":         { label: "Last",         shortcut: "End",        group: "go" },
};

/** Canonical layout per group.
 *  - `"sep"` becomes a menu separator IFF visible items exist on both sides.
 *  - `"custom"` is the slot where customMenu items for this group land.
 *    When a group has both canonical actions and customs, surrounding
 *    separators auto-collapse if either side is empty. */
export const MENU_LAYOUT: Record<MenuGroup, (ActionId | "sep" | "custom")[]> = {
  file:   ["new", "open", "sep", "save", "save-as", "sep", "custom", "sep", "close-window", "quit"],
  edit:   ["undo", "redo", "sep", "cut", "copy", "paste", "sep", "select-all", "sep", "custom"],
  image:  ["custom"],
  filter: ["custom"],
  view:   ["zoom-in", "zoom-out", "sep", "zoom-fit", "zoom-actual", "sep", "fullscreen", "toggle-sidebar", "sep", "custom"],
  go:     ["previous", "next", "sep", "first", "last", "sep", "custom"],
  help:   ["custom"],
};

export const GROUP_LABEL: Record<MenuGroup, string> = {
  file:   "File",
  edit:   "Edit",
  image:  "Image",
  filter: "Filter",
  view:   "View",
  go:     "Go",
  help:   "Help",
};

/** Order menus appear in the menu bar. */
export const GROUP_ORDER: MenuGroup[] =
  ["file", "edit", "image", "filter", "view", "go", "help"];

/** Edit-class actions defer to the browser when focus is in a text field —
 *  binding Ctrl+Z globally would shadow CodeMirror / textarea undo. The
 *  package skips dispatch in that case and the browser's native handling
 *  takes over. */
const TEXT_DEFER: ReadonlySet<ActionId> = new Set([
  "undo", "redo", "cut", "copy", "paste", "select-all",
]);

export function shouldDeferToText(id: ActionId): boolean {
  return TEXT_DEFER.has(id);
}
