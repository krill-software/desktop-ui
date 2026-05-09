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
export declare function buildEmptyState(opts: {
    primary: string;
    hint?: string;
}): HTMLElement;
/** Shared "couldn't open this file" placeholder. Same shape as the empty
 *  state but with a slot for the failing filename.
 *
 *  Usage:
 *    const error = buildErrorState({ primary: "Can't open this PDF." });
 *    chrome.viewport.appendChild(error.element);
 *    // later:
 *    error.setFilename("broken.pdf");
 *    error.element.hidden = false;
 */
export interface ErrorStateRefs {
    element: HTMLElement;
    /** Set the filename shown in the hint line. Pass empty string to clear. */
    setFilename: (name: string) => void;
}
export declare function buildErrorState(opts: {
    primary: string;
}): ErrorStateRefs;
//# sourceMappingURL=empty-state.d.ts.map