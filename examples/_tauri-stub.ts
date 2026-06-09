/* Browser stub for @tauri-apps/api/window.
 *
 * The examples run in a plain Vite dev server (no Tauri runtime) so the
 * chrome/style can be developed with instant HMR and no Rust toolchain.
 * desktop-ui's titlebar calls getCurrentWindow() at mount and binds the
 * min/max/close buttons to it — without a stub that throws in the browser.
 * Here the window controls become no-ops, which is fine: examples are for
 * looking at the style, not for real windowing.
 *
 * Wired in via resolve.alias in vite.config.ts — desktop-ui source is not
 * modified. */

const noopWindow = {
  minimize: async () => {},
  maximize: async () => {},
  unmaximize: async () => {},
  isMaximized: async () => false,
  close: async () => {},
  setTitle: async (_: string) => {},
};

export function getCurrentWindow() {
  return noopWindow;
}
