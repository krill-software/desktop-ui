/** The main pane's top strip: a drag region with min / max / close on the
 *  right, wired to the current window. */
export declare function buildMainTopbar(): HTMLElement;
/** The aux pane's top strip: the color-mode toggle and a hamburger on the left
 *  (caller wires the hamburger to the menu) plus a drag region. Returns the
 *  strip, the hamburger, and the theme toggle (already wired) so the no-aux
 *  layout can re-home both into the main strip. */
export declare function buildAuxTopbar(): {
    auxTopbar: HTMLElement;
    hamburger: HTMLElement;
    theme: HTMLElement;
};
//# sourceMappingURL=topbar.d.ts.map