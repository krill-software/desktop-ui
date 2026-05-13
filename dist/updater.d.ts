/** Updater glue for krill apps. Wraps `tauri-plugin-updater` with the
 *  user-facing dialog flow that every krill app shares:
 *
 *    1. Check the manifest hosted at the app's release endpoint.
 *    2. If no update → quietly confirm "you're up to date".
 *    3. If update → ask before downloading; download + install + relaunch.
 *    4. On Linux, gracefully explain that auto-updates only work when
 *       running as an AppImage (the .deb is owned by apt).
 *
 *  No boot-time polling, no status-line indicator — this only runs when
 *  the user picks "Help → Check for updates…". Quietness is the brand. */
/** Run the full check / confirm / install / relaunch flow. Imports are
 *  dynamic so apps that don't enable the updater pay no bundle cost. */
export declare function checkForUpdates(productName: string): Promise<void>;
//# sourceMappingURL=updater.d.ts.map