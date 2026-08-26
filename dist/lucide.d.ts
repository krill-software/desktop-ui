import { type IconNode } from "lucide";
/** A Lucide glyph as an inline SVG for app chrome — sidebar rows, toolbar
 *  buttons, list icons. Stroked in `currentColor` so CSS picks the color,
 *  sized 16px by default, and hidden from assistive tech (pair it with a
 *  text label or an `aria-label` on the button).
 *
 *  Pass the icon node itself rather than a name —
 *  `lucideIcon(Folder)` with `import { Folder } from "lucide"` — so each
 *  app's bundle tree-shakes down to the glyphs it actually uses instead
 *  of carrying the whole `icons` map. */
export declare function lucideIcon(node: IconNode, size?: number): SVGElement;
//# sourceMappingURL=lucide.d.ts.map