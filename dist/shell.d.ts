import type { ChromeRefs, MountChromeOptions } from "./types.js";
/** Build and mount the standard krill app chrome — titlebar, menu bar,
 *  optional status line, viewport. Returns refs the app uses to populate
 *  dynamic content (filename, status indicators) and to render its
 *  working view (`viewport`).
 *
 *  The menu bar and keyboard shortcuts are derived from the `actions`
 *  map (canonical actions with package-owned label / shortcut / group)
 *  and `customMenu` (app-specific extras). `bindings` adds shortcuts
 *  that don't surface as menu entries. */
export declare function mountChrome(opts: MountChromeOptions): ChromeRefs;
//# sourceMappingURL=shell.d.ts.map