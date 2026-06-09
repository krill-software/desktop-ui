import "../src/styles/index.css";
import "./examples.css";
import { mountChrome } from "../src/index.js";

/* App layout: no titlebar / status line. The main pane carries its own top
 * strip (drag region + window controls), the aux pane carries a strip with a
 * hamburger that opens the menu, and content scrolls in .main-content. Used by
 * file-drop, audio-editor, paint, color-editor, system-monitor,
 * markdown-viewer, photo-importer. */

const chrome = mountChrome({
  productName: "App",
  version: "0.0.0",
  layout: "app",
  showAuxPane: true,
  actions: {
    new: () => {},
    open: () => {},
    save: () => {},
    undo: () => {},
    redo: () => {},
  },
});

chrome.aux!.insertAdjacentHTML(
  "beforeend",
  `<div class="demo-aux-content">
    Aux pane with its own strip — the hamburger (top-left) opens the menu.
    Tools / navigation / a list of items would live here.
  </div>`,
);

chrome.mainContent!.innerHTML = `
  <article class="demo-doc">
    <h2>App layout (sidebar workspace)</h2>
    <p>No titlebar or status line. The main pane's own top strip holds the
    drag region and the min / max / close window controls; the aux strip holds
    the hamburger menu. Content lives in <code>chrome.mainContent</code> and
    scrolls independently.</p>
    <p>Enabled with <code>mountChrome({ layout: "app" })</code>.</p>
  </article>`;
