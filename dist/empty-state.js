/** Default empty-state message — one terse line that's identical across every
 *  krill file-app. Apps that want a different copy pass `message` explicitly. */
const DEFAULT_EMPTY_MESSAGE = 'Drop a file or press <kbd>Ctrl</kbd>+<kbd>O</kbd> to open.';
/** Centered "no file open" placeholder used in every krill file-app.
 *  One line of muted text, vertically + horizontally centered in the viewport.
 *
 *  Usage:
 *    const empty = buildEmptyState();
 *    chrome.viewport.appendChild(empty);
 *    // toggle:
 *    empty.hidden = (state.doc !== null);
 *
 *  The default message is the canonical krill copy and should rarely be
 *  overridden — consistency across apps matters more than per-app phrasing. */
export function buildEmptyState(opts = {}) {
    const wrap = document.createElement("div");
    wrap.className = "krill-empty-state";
    const msg = document.createElement("p");
    msg.className = "message";
    msg.innerHTML = opts.message ?? DEFAULT_EMPTY_MESSAGE;
    wrap.appendChild(msg);
    return wrap;
}
/** Centered "couldn't open this file" placeholder. Default message is one
 *  line; the failing filename appears underneath in mono when set. */
const DEFAULT_ERROR_MESSAGE = "Couldn't open this file.";
export function buildErrorState(opts = {}) {
    const wrap = document.createElement("div");
    wrap.className = "krill-error-state";
    const msg = document.createElement("p");
    msg.className = "message";
    msg.textContent = opts.message ?? DEFAULT_ERROR_MESSAGE;
    wrap.appendChild(msg);
    const filename = document.createElement("p");
    filename.className = "filename";
    wrap.appendChild(filename);
    return {
        element: wrap,
        setFilename: (name) => { filename.textContent = name; },
    };
}
//# sourceMappingURL=empty-state.js.map