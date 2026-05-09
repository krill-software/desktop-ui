// ---- Menu groups ------------------------------------------------------

export type MenuGroup = "file" | "edit" | "view" | "go" | "help";

// ---- Canonical actions ------------------------------------------------

/** Every shortcut + label krill apps share lives here. Each app picks
 *  which actions it supports by registering callbacks on `mountChrome`'s
 *  `actions` map; the package owns the label, shortcut, and menu group. */
export type ActionId =
  // File
  | "new" | "open" | "save" | "save-as" | "close-window" | "quit"
  // Edit
  | "undo" | "redo" | "cut" | "copy" | "paste" | "select-all"
  // View
  | "zoom-in" | "zoom-out" | "zoom-fit" | "zoom-actual"
  | "fullscreen" | "toggle-sidebar"
  // Go
  | "previous" | "next" | "first" | "last";

export type ActionCallback = () => void | Promise<void>;

// ---- Custom (app-specific) menu extensions ---------------------------

/** A single item appended to a canonical menu group. */
export type CustomMenuItem =
  | { label: string; shortcut?: string; action: ActionCallback }
  | { sep: true };

export interface CustomMenuExtension {
  group: MenuGroup;
  items: CustomMenuItem[];
}

// ---- Low-level menu types (escape hatch) ------------------------------

export type MenuItem =
  | { label: string; shortcut?: string; action: ActionCallback }
  | { sep: true };

export interface MenuDef {
  label: string;
  items: MenuItem[];
}

// ---- mountChrome options + return -------------------------------------

export interface ChromeRefs {
  /** The bottom-of-window status line, if `showStatusLine` was true. */
  statusLine: HTMLElement | null;
  /** Centered title span inside the titlebar — apps may override its textContent on file load. */
  title: HTMLElement;
  /** The menu-bar container inside the titlebar. Most apps don't touch this directly. */
  menuBar: HTMLElement;
  /** Container element where the app should mount its working view. */
  viewport: HTMLElement;
}

export interface MountChromeOptions {
  /** Display name shown in the centered title. */
  productName: string;
  /** Map of canonical actions → callback. The package wires their canonical
   *  shortcuts and inserts them into the menu in the canonical order.
   *  `close-window` and `quit` are auto-included with package defaults if
   *  not overridden — every krill app has them. */
  actions?: Partial<Record<ActionId, ActionCallback | undefined>>;
  /** App-specific menu items appended after the canonical ones in their
   *  group. Use this for things that aren't in the canonical action set
   *  (e.g., "Export HTML" in markdown-editor, "Refresh" in rss-reader). */
  customMenu?: CustomMenuExtension[];
  /** Arbitrary shortcuts that don't surface in the menu (e.g., PageUp/PageDown
   *  as alternates for previous/next). Map of shortcut string → callback. */
  bindings?: Record<string, ActionCallback>;
  /** Render a 24px status line at the bottom of the window. */
  showStatusLine?: boolean;
  /** Where to mount the chrome. Defaults to `document.body`. */
  parent?: HTMLElement;
}
