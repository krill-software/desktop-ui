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
export async function checkForUpdates(productName) {
    const dialog = await import("@tauri-apps/plugin-dialog");
    let update;
    try {
        const updater = await import("@tauri-apps/plugin-updater");
        update = (await updater.check());
    }
    catch (e) {
        await explainLinuxLimitOrError(dialog, e, productName);
        return;
    }
    if (!update) {
        await dialog.message(`${productName} is up to date.`, {
            title: "Check for updates",
            kind: "info",
        });
        return;
    }
    const proceed = await dialog.ask(`${productName} ${update.version} is available.\n\n` +
        `Install it now? The app will restart after installing.`, { title: "Update available", kind: "info" });
    if (!proceed)
        return;
    try {
        await update.downloadAndInstall();
        const process = await import("@tauri-apps/plugin-process");
        await process.relaunch();
    }
    catch (e) {
        await dialog.message(`Update failed: ${String(e)}`, {
            title: "Update",
            kind: "error",
        });
    }
}
/** Distinguish "this app was installed via apt and can't self-update" from
 *  a real error. The updater plugin throws on Linux when not running as
 *  AppImage; surface that as friendly guidance rather than a stack trace. */
async function explainLinuxLimitOrError(dialog, err, productName) {
    const msg = String(err).toLowerCase();
    const looksLikeLinuxLimit = msg.includes("appimage") ||
        msg.includes("not supported") ||
        msg.includes("unsupported");
    if (looksLikeLinuxLimit) {
        await dialog.message(`${productName} was installed via your system package manager. ` +
            `To upgrade, run:\n\n  sudo apt install --only-upgrade <package>\n\n` +
            `In-app updates are available only when running the AppImage build.`, { title: "Update", kind: "info" });
        return;
    }
    await dialog.message(`Couldn't check for updates: ${String(err)}`, {
        title: "Update",
        kind: "error",
    });
}
//# sourceMappingURL=updater.js.map