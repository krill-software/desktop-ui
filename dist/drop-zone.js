//! Shared file drop zone.
//!
//! A dashed-border target that turns solid on hover / focus / drag-over and
//! opens a file picker when activated. The element is a plain `<button>`, so
//! it handles click and keyboard (Enter / Space) for free. The consumer owns
//! what "open a picker" and "a file arrived" mean — wire `onActivate` to your
//! Tauri dialog and call `setDragActive` from your webview drag-drop events —
//! which keeps this domain- and platform-agnostic, the same way every krill
//! app's empty-load state should look identical.
function uploadIcon() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.8");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("width", "28");
    svg.setAttribute("height", "28");
    svg.setAttribute("aria-hidden", "true");
    // Lucide "upload".
    for (const d of ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]) {
        const p = document.createElementNS(ns, "path");
        p.setAttribute("d", d);
        svg.append(p);
    }
    return svg;
}
export function buildDropZone(opts) {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "fm-dropzone";
    el.append(opts.icon ?? uploadIcon());
    const label = document.createElement("span");
    label.className = "fm-dropzone-label";
    label.textContent = opts.label ?? "Drop a file here";
    el.append(label);
    const hintText = opts.hint ?? "or click to browse";
    if (hintText) {
        const hint = document.createElement("span");
        hint.className = "fm-dropzone-hint";
        hint.textContent = hintText;
        el.append(hint);
    }
    el.addEventListener("click", () => opts.onActivate());
    return {
        element: el,
        setDragActive(active) {
            el.dataset.drag = active ? "true" : "false";
        },
    };
}
//# sourceMappingURL=drop-zone.js.map