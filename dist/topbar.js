import { getCurrentWindow } from "@tauri-apps/api/window";
import { THEME_TOGGLE_SVG, wireThemeToggle } from "./theme.js";
/* Top-strip chrome for the app layout: in-viewport top bars that replace the
 * titlebar for apps that forgo the document chrome (file-drop, audio-editor,
 * paint). The layout is "app"; these strips are its top bars.
 *
 *   main pane:  [ ……… drag region ……… ]  [ —  □  × ]
 *   aux pane :  [≡]  [ ……… drag region ……… ]
 *
 * Window-control glyphs are the same ones the titlebar uses, so app-layout apps
 * read as the same family as the titlebar apps. The bar itself is the drag
 * region (data-tauri-drag-region); the buttons sit inside it but, lacking
 * the attribute, stay clickable. */
const MIN_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
  <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
const MAX_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
  <rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
</svg>`;
const CLOSE_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
  <line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
const MENU_SVG = `<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
  <line x1="2" y1="4" x2="12" y2="4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="10" x2="12" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
function iconButton(label, svg, kind) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "main-topbar-btn";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    if (kind)
        btn.dataset.kind = kind;
    btn.innerHTML = svg;
    return btn;
}
/** The main pane's top strip: a drag region with min / max / close on the
 *  right, wired to the current window. */
export function buildMainTopbar() {
    const bar = document.createElement("div");
    bar.className = "main-topbar";
    bar.setAttribute("data-tauri-drag-region", "");
    const w = getCurrentWindow();
    const theme = iconButton("Toggle theme", THEME_TOGGLE_SVG);
    wireThemeToggle(theme);
    const min = iconButton("Minimize", MIN_SVG);
    min.addEventListener("click", () => void w.minimize());
    const max = iconButton("Maximize", MAX_SVG);
    max.addEventListener("click", async () => (await w.isMaximized()) ? w.unmaximize() : w.maximize());
    const close = iconButton("Close", CLOSE_SVG, "close");
    close.addEventListener("click", () => void w.close());
    bar.append(theme, min, max, close);
    return bar;
}
/** The aux pane's top strip: a hamburger on the left (caller wires it to the
 *  menu) plus a drag region. Returns the strip and the hamburger button. */
export function buildAuxTopbar() {
    const bar = document.createElement("div");
    bar.className = "aux-topbar";
    bar.setAttribute("data-tauri-drag-region", "");
    const hamburger = iconButton("Menu", MENU_SVG);
    bar.append(hamburger);
    return { auxTopbar: bar, hamburger };
}
//# sourceMappingURL=topbar.js.map