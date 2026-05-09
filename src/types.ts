// ---- Menu groups ------------------------------------------------------

export type MenuGroup =
  | "file" | "edit" | "image" | "filter" | "view" | "go" | "help";

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
  /** Centered title span inside the titlebar — apps set its textContent to
   *  the active filename (or leave it as the productName when no file is
   *  open). The dirty bullet is added automatically via a CSS pseudo-element
   *  driven by `body[data-dirty="true"]`. */
  title: HTMLElement;
  /** The menu-bar container inside the titlebar. Most apps don't touch this directly. */
  menuBar: HTMLElement;
  /** MAIN pane — primary work view (canvas, page reader, editor, color
   *  wheel). On the right when an aux pane is also shown. */
  viewport: HTMLElement;
  /** AUX pane — left-side support surface (tools, settings, navigation,
   *  output panels). Null if `showAuxPane` was false. Width is fixed at
   *  260px in v0.3; resizable splitter is a future feature. */
  aux: HTMLElement | null;
  /** The bottom status line container, if `showStatusLine` was true. */
  statusLine: HTMLElement | null;
  /** LEFT half of the status line. Holds *file identity* — type, size,
   *  structural dimensions. Doesn't change as the user scrolls or types. */
  statusInfo: HTMLElement | null;
  /** RIGHT half of the status line. Holds *position / state* — page X/Y,
   *  word count, zoom percentage, current mode. Changes constantly. */
  statusState: HTMLElement | null;
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
  /** Render a left-side AUX pane (260px wide). Used for tools, navigation,
   *  settings panels — the support surface beside the main work view.
   *  Apps that don't need an aux pane (image-viewer, markdown-editor)
   *  leave this false. */
  showAuxPane?: boolean;
  /** Where to mount the chrome. Defaults to `document.body`. */
  parent?: HTMLElement;
}
