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
export function showBootError(error) {
    // Clear whatever the previous boot attempt managed to mount, and reset
    // body data attributes that could still be driving CSS (data-aux,
    // data-state, data-fullscreen, data-dirty).
    document.body.replaceChildren();
    for (const k of ["aux", "state", "fullscreen", "dirty", "mode"]) {
        delete document.body.dataset[k];
    }
    document.body.classList.add("krill-boot-error-host");
    const wrap = document.createElement("div");
    wrap.className = "krill-boot-error";
    const inner = document.createElement("div");
    wrap.appendChild(inner);
    const title = document.createElement("p");
    title.className = "title";
    title.textContent = "Something went wrong starting this app.";
    inner.appendChild(title);
    const detail = document.createElement("pre");
    detail.className = "detail";
    detail.textContent = formatError(error);
    inner.appendChild(detail);
    const actions = document.createElement("div");
    actions.className = "actions";
    const reload = document.createElement("button");
    reload.className = "reload";
    reload.type = "button";
    reload.textContent = "Reload window";
    reload.addEventListener("click", () => window.location.reload());
    actions.appendChild(reload);
    inner.appendChild(actions);
    document.body.appendChild(wrap);
}
function formatError(e) {
    if (e instanceof Error) {
        return e.stack ?? `${e.name}: ${e.message}`;
    }
    if (typeof e === "string")
        return e;
    try {
        return JSON.stringify(e, null, 2);
    }
    catch {
        return String(e);
    }
}
//# sourceMappingURL=boot-error.js.map