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
export declare function buildEmptyState(opts?: {
    message?: string;
}): HTMLElement;
export interface ErrorStateRefs {
    element: HTMLElement;
    /** Set the filename shown beneath the error message. Pass empty string to clear. */
    setFilename: (name: string) => void;
}
export declare function buildErrorState(opts?: {
    message?: string;
}): ErrorStateRefs;
//# sourceMappingURL=empty-state.d.ts.map