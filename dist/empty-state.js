/** Shared "no file open" placeholder centered in the working view.
 *  Builds the DOM and returns the element; the app appends it to
 *  `chrome.viewport` and toggles its `hidden` attribute as state changes.
 *
 *  Usage:
 *    const empty = buildEmptyState({
 *      primary: "No document open.",
 *      hint: 'Drop a PDF here, or press <kbd>Ctrl</kbd>+<kbd>O</kbd>.',
 *    });
 *    chrome.viewport.appendChild(empty);
 *    // later:
 *    empty.hidden = (state.doc !== null);
 *
 *  `hint` accepts inline HTML so callers can include the standard
 *  `<kbd>` markup. Keep it short — one sentence. */
export function buildEmptyState(opts) {
    const wrap = document.createElement("div");
    wrap.className = "krill-empty-state";
    const inner = document.createElement("div");
    wrap.appendChild(inner);
    const primary = document.createElement("p");
    primary.className = "primary";
    primary.textContent = opts.primary;
    inner.appendChild(primary);
    if (opts.hint) {
        const hint = document.createElement("p");
        hint.className = "hint";
        hint.innerHTML = opts.hint;
        inner.appendChild(hint);
    }
    return wrap;
}
export function buildErrorState(opts) {
    const wrap = document.createElement("div");
    wrap.className = "krill-error-state";
    const inner = document.createElement("div");
    wrap.appendChild(inner);
    const primary = document.createElement("p");
    primary.className = "primary";
    primary.textContent = opts.primary;
    inner.appendChild(primary);
    const filename = document.createElement("p");
    filename.className = "hint";
    inner.appendChild(filename);
    return {
        element: wrap,
        setFilename: (name) => { filename.textContent = name; },
    };
}
//# sourceMappingURL=empty-state.js.map