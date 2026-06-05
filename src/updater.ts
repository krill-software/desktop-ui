/** Updater glue for krill apps. Wraps `tauri-plugin-updater` with the
 *  user-facing dialog flow that every krill app shares:
 *
 *    1. Check the manifest hosted at the app's release endpoint.
 *    2. If no update → quietly confirm "you're up to date".
 *    3. If update → ask before downloading; download + install + relaunch.
 *    4. On Linux, gracefully explain that in-app updates only work for the
 *       AppImage build — a .deb/.rpm install is owned by the package
 *       manager and can't swap itself in place.
 *
 *  No boot-time polling, no status-line indicator — this only runs when
 *  the user picks "Help → Check for updates…". Quietness is the brand. */

/** Run the full check / confirm / install / relaunch flow. Imports are
 *  dynamic so apps that don't enable the updater pay no bundle cost. */
export async function checkForUpdates(productName: string): Promise<void> {
  const dialog = await import("@tauri-apps/plugin-dialog");

  let update: { version: string; downloadAndInstall: () => Promise<void> } | null;
  try {
    const updater = await import("@tauri-apps/plugin-updater");
    update = (await updater.check()) as typeof update;
  } catch (e) {
    if (await explainIfSystemInstall(dialog, e, productName)) return;
    await dialog.message(`Couldn't check for updates: ${String(e)}`, {
      title: "Update",
      kind: "error",
    });
    return;
  }

  if (!update) {
    await dialog.message(`${productName} is up to date.`, {
      title: "Check for updates",
      kind: "info",
    });
    return;
  }

  const proceed = await dialog.ask(
    `${productName} ${update.version} is available.\n\n` +
      `Install it now? The app will restart after installing.`,
    { title: "Update available", kind: "info" },
  );
  if (!proceed) return;

  try {
    await update.downloadAndInstall();
    const process = await import("@tauri-apps/plugin-process");
    await process.relaunch();
  } catch (e) {
    // A .deb/.rpm install gets this far — the version check succeeds, then the
    // plugin downloads the AppImage and rejects it as the wrong package format
    // at install time. Treat that as the system-install case, not a failure.
    if (await explainIfSystemInstall(dialog, e, productName)) return;
    await dialog.message(`Update failed: ${String(e)}`, {
      title: "Update",
      kind: "error",
    });
  }
}

/** If `err` indicates the app is a system-package (.deb/.rpm) install that
 *  can't self-update, show friendly guidance and return true. Otherwise
 *  return false so the caller surfaces the real error.
 *
 *  Two failure shapes reach us, depending on how the app was installed and
 *  the Tauri version:
 *   - some versions throw an AppImage / "not supported" message at check
 *     time; and
 *   - a .deb/.rpm install downloads the AppImage and then rejects it as the
 *     wrong package format at install time — Tauri's `InvalidUpdaterFormat`,
 *     surfaced as "invalid updater binary format" — because it validates the
 *     AppImage bytes as a .deb/.rpm.
 *  Both mean the same thing for the user: upgrade via the package, not
 *  in-app. */
async function explainIfSystemInstall(
  dialog: typeof import("@tauri-apps/plugin-dialog"),
  err: unknown,
  productName: string,
): Promise<boolean> {
  const msg = String(err).toLowerCase();
  const isSystemInstall =
    msg.includes("appimage") ||
    msg.includes("not supported") ||
    msg.includes("unsupported") ||
    msg.includes("invalid updater binary format") ||
    msg.includes("invalid updater format");

  if (!isSystemInstall) return false;

  await dialog.message(
    `${productName} was installed from a system package (.deb), so it ` +
      `can't update itself in place.\n\n` +
      `To upgrade, install the latest .deb from the releases page, or ` +
      `switch to the AppImage build — that one updates from inside the app.`,
    { title: "Update", kind: "info" },
  );
  return true;
}
