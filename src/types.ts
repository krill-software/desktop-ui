export type MenuItem =
  | { label: string; shortcut?: string; action: () => void }
  | { sep: true };

export interface MenuDef {
  label: string;
  items: MenuItem[];
}

export interface ChromeRefs {
  /** The bottom-of-window status line, if `showStatusLine` was true. */
  statusLine: HTMLElement | null;
  /** Centered title span inside the titlebar — set its textContent on file load. */
  title: HTMLElement;
  /** The menu-bar container. You typically don't touch this directly. */
  menuBar: HTMLElement;
  /** Container element where the app should mount its working view. */
  viewport: HTMLElement;
}

export interface MountChromeOptions {
  /** Display name shown in the window's centered title. */
  productName: string;
  /** Menu definitions for the inline menu bar. Pass `[]` to hide the menu. */
  menus: MenuDef[];
  /** Render a 24px status line at the bottom of the window. */
  showStatusLine?: boolean;
  /** Where to mount the chrome. Defaults to `document.body`. */
  parent?: HTMLElement;
}
