import "../src/styles/index.css";
import "./examples.css";
import { mountChrome } from "../src/index.js";

/* Quiet single-column archetype: titlebar + inline menu, a chrome-free
 * viewport, and a status line. No aux pane. The shape most krill apps use
 * (text-editor, image-viewer, document-viewer, csv-editor, markdown-editor). */

const chrome = mountChrome({
  productName: "Quiet",
  version: "0.0.0",
  showStatusLine: true,
  actions: {
    new: () => {},
    open: () => {},
    save: () => {},
    "save-as": () => {},
    undo: () => {},
    redo: () => {},
    "zoom-in": () => {},
    "zoom-out": () => {},
  },
});

chrome.title.textContent = "example.txt";
chrome.statusInfo!.textContent = "v0.0.0";
chrome.statusState!.textContent = "Ln 6 · Col 36 · UTF-8";

chrome.viewport.innerHTML = `
  <article class="demo-doc">
    <h2>Quiet single-column chrome</h2>
    <p>This is the archetype most krill apps follow: a titlebar with the
    inline menu, a viewport with no controls in it, and a status line.</p>
    <p>Edit <code>desktop-ui/src/styles/*.css</code> and this page updates
    live — the example imports straight from <code>../src</code>.</p>
  </article>`;
