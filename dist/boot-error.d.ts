/** Boot-crash screen used by every krill app.
 *
 *  When boot() throws — package imports broken, mountChrome blew up,
 *  TS-noticed-too-late type error — the user shouldn't see an empty
 *  white window with no menu, no titlebar, no clue. Call this from the
 *  top-level catch and the user gets a calm centered error card with
 *  the actual message + a reload button.
 *
 *  Usage:
 *
 *    import { showBootError } from "@krill-software/desktop-ui";
 *
 *    boot().catch((e) => {
 *      console.error("boot failed:", e);
 *      showBootError(e);
 *    });
 *
 *  The screen replaces the entire body, so it works even when
 *  mountChrome itself was the thing that failed. */
export declare function showBootError(error: unknown): void;
//# sourceMappingURL=boot-error.d.ts.map