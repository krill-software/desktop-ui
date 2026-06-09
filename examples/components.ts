import "../src/styles/index.css";
import "./examples.css";
import {
  buildEmptyState,
  buildErrorState,
  buildLoader,
  buildFilterInput,
} from "../src/index.js";

/* Gallery of the shared UI primitives, each in a bordered cell so the empty
 * and error states (normally absolute-positioned over a viewport) are visible
 * side by side. */

const grid = document.createElement("div");
grid.className = "demo-grid";

function cell(title: string, node: Node): void {
  const section = document.createElement("section");
  const h = document.createElement("h3");
  h.textContent = title;
  section.append(h, node);
  grid.append(section);
}

cell("Empty state", buildEmptyState());

const err = buildErrorState();
err.setFilename("broken.png");
cell("Error state", err.element);

cell("Loader", buildLoader({ label: "Scanning…" }));

const filter = buildFilterInput({ placeholder: "Filter…", onChange: () => {} });
cell("Filter input", filter.element);

const hint = document.createElement("div");
hint.style.cssText = "font-family: var(--fm-sans); font-size: var(--text-body, 13px);";
hint.innerHTML = "Press <kbd>Ctrl</kbd>+<kbd>O</kbd> to open.";
cell("Keybinding hint (kbd)", hint);

document.body.append(grid);
