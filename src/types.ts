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
  | "previous" | "next" | "first" | "last"
  // Help
  | "check-for-updates";

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
  | { sep: true }
  /** Non-interactive muted line (e.g. the Help-menu version label). */
  | { label: string; static: true };

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
   *  wheel). On the right when an aux pane is also shown. In the app
   *  layout (`layout: "app"`) this is the flex column that holds the
   *  in-viewport main-topbar plus `mainContent`; render into `mainContent`,
   *  not here. */
  viewport: HTMLElement;
  /** Scroll content area below the in-viewport main-topbar, present only in
   *  the app layout (`layout: "app"`). Apps render their working view here.
   *  Null in standard titlebar chrome. */
  mainContent: HTMLElement | null;
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
  /** Window layout.
   *  - `"document"` (default): the classic framed desktop window — menu bar +
   *    centered title in the titlebar, status line at the bottom.
   *  - `"app"`: the app-style workspace — no titlebar/status line; the main
   *    pane carries its own top strip (drag region + min/max/close window
   *    controls) and a scrollable content area, and the aux pane gets a
   *    matching strip with a hamburger that opens the menu. Render the working
   *    view into `chrome.mainContent`; `version` still feeds the Help menu via
   *    the hamburger. Used by file-drop, audio-editor, paint, and others. */
  layout?: "document" | "app";
  /** Where to mount the chrome. Defaults to `document.body`. */
  parent?: HTMLElement;
  /** Enable the canonical "Check for updates…" entry in the Help menu.
   *  Wires to `tauri-plugin-updater` on the Rust side — every krill app
   *  that ships AppImages should set this true. No boot-time check, no
   *  status-line indicator: updates are pull-only via the menu. */
  updater?: boolean;
  /** App version (from package.json). When set, the Help menu opens
   *  with a static, non-interactive line: `<productName> <version>`.
   *  Krill's entire "About" surface — no dialog, no credits screen. */
  version?: string;
}
