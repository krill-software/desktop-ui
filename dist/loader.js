//! Shared loader / spinner.
//!
//! A single visible "we're working on it" cue used wherever an async
//! operation is in flight — long file walks, network probes, device
//! enumeration, etc. The animation lives in `styles/loader.css` so
//! it's CSS-driven and consistent across apps.
const SVG_NS = "http://www.w3.org/2000/svg";
/** Build a Lucide-`loader-2`-style spinning glyph. Standalone — use
 *  when you want just the icon (inside a button, a row, a status
 *  badge). For a full "loading + label" block, see `buildLoader`. */
export function buildLoaderIcon(size = 16) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    svg.setAttribute("aria-hidden", "true");
    svg.classList.add("fm-loader-icon");
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", "M21 12a9 9 0 1 1-6.219-8.56");
    svg.append(p);
    return svg;
}
/** Build a `<icon> <label>` inline-flex loader block. Drop into any
 *  list / pane that's mid-scan. Label is optional — pass nothing for
 *  the icon alone. */
export function buildLoader(opts = {}) {
    const wrap = document.createElement("div");
    wrap.className = "fm-loader";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    wrap.append(buildLoaderIcon(16));
    if (opts.label !== undefined && opts.label !== "") {
        const span = document.createElement("span");
        span.className = "fm-loader-label";
        span.textContent = opts.label;
        wrap.append(span);
    }
    return wrap;
}
//# sourceMappingURL=loader.js.map