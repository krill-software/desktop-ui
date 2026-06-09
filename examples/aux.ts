import "../src/styles/index.css";
import "./examples.css";
import { mountChrome } from "../src/index.js";

/* Manipulation archetype: same chrome as quiet, plus a 260px left aux pane
 * for tools / navigation / settings. Used by image-editor, color-editor. */

const chrome = mountChrome({
  productName: "Manipulation",
  version: "0.0.0",
  showStatusLine: true,
  showAuxPane: true,
  actions: {
    new: () => {},
    open: () => {},
    save: () => {},
    undo: () => {},
    redo: () => {},
    "zoom-in": () => {},
    "zoom-out": () => {},
    "zoom-fit": () => {},
  },
});

chrome.title.textContent = "example.png";
chrome.statusInfo!.textContent = "v0.0.0";
chrome.statusState!.textContent = "1920 × 1080 · 100%";

chrome.aux!.innerHTML = `
  <div class="demo-aux-content">
    Aux pane (260px). Tools, navigation, settings, and output panels live
    here — the support surface beside the main work view.
  </div>`;

chrome.viewport.innerHTML = `
  <article class="demo-doc">
    <h2>Manipulation chrome (aux pane)</h2>
    <p>The aux pane sits on the left at a fixed 260px; the viewport flexes
    beside it. Toggle it via <code>showAuxPane</code> in mountChrome.</p>
  </article>`;
