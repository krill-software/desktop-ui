/** Build a Lucide-`loader-2`-style spinning glyph. Standalone — use
 *  when you want just the icon (inside a button, a row, a status
 *  badge). For a full "loading + label" block, see `buildLoader`. */
export declare function buildLoaderIcon(size?: number): SVGSVGElement;
/** Build a `<icon> <label>` inline-flex loader block. Drop into any
 *  list / pane that's mid-scan. Label is optional — pass nothing for
 *  the icon alone. */
export declare function buildLoader(opts?: {
    label?: string;
}): HTMLDivElement;
//# sourceMappingURL=loader.d.ts.map