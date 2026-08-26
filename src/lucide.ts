import { createElement, type IconNode } from "lucide";

/** A Lucide glyph as an inline SVG for app chrome — sidebar rows, toolbar
 *  buttons, list icons. Stroked in `currentColor` so CSS picks the color,
 *  sized 16px by default, and hidden from assistive tech (pair it with a
 *  text label or an `aria-label` on the button).
 *
 *  Pass the icon node itself rather than a name —
 *  `lucideIcon(Folder)` with `import { Folder } from "lucide"` — so each
 *  app's bundle tree-shakes down to the glyphs it actually uses instead
 *  of carrying the whole `icons` map. */
export function lucideIcon(node: IconNode, size = 16): SVGElement {
  const svg = createElement(node);
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("aria-hidden", "true");
  return svg;
}
