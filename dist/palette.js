// GIMP Palette (.gpl) read/write — the shared krill palette format. Plain
// text, optional per-color names, and read natively by GIMP / Krita /
// Inkscape / Aseprite, so a krill palette also works in other tools. One
// parser, shared by every app that produces or consumes palettes.
//
// Format:
//   GIMP Palette
//   Name: Sunset
//   Columns: 8
//   # an optional comment
//   221 117 150	accent
//    48  52  63	ink
function clampByte(n) {
    return Math.max(0, Math.min(255, Math.round(n)));
}
function rgbToHex(r, g, b) {
    const h = (n) => clampByte(n).toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}
function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
    if (m)
        return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
    const s = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex.trim());
    if (s) {
        return [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16)];
    }
    return null;
}
/** Parse GIMP Palette text. Lenient: a missing magic line, stray comments, or
 *  malformed color rows are tolerated — only well-formed `R G B [name]` rows
 *  become colors. */
export function parseGpl(text) {
    const lines = text.split(/\r?\n/);
    let name = "";
    let columns = 0;
    const colors = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (i === 0 && /^GIMP Palette/i.test(trimmed))
            continue;
        if (trimmed === "" || trimmed.startsWith("#"))
            continue;
        const nameHeader = /^Name:\s*(.*)$/i.exec(trimmed);
        if (nameHeader) {
            name = nameHeader[1].trim();
            continue;
        }
        const colHeader = /^Columns:\s*(\d+)/i.exec(trimmed);
        if (colHeader) {
            columns = parseInt(colHeader[1], 10);
            continue;
        }
        // A color row: three integers, then an optional name (the rest of the line).
        const m = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s+(.*))?$/.exec(trimmed);
        if (!m)
            continue;
        const hex = rgbToHex(parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10));
        const colorName = m[4]?.trim();
        colors.push(colorName ? { hex, name: colorName } : { hex });
    }
    return { name, columns, colors };
}
/** Serialize colors to GIMP Palette text. Accepts `{ hex, name? }` objects or
 *  bare hex strings. */
export function serializeGpl(opts) {
    const name = opts.name?.trim() || "krill palette";
    const columns = opts.columns ?? 0;
    const out = ["GIMP Palette", `Name: ${name}`, `Columns: ${columns}`, "#"];
    for (const c of opts.colors) {
        const hex = typeof c === "string" ? c : c.hex;
        const colorName = typeof c === "string" ? undefined : c.name;
        const rgb = hexToRgb(hex);
        if (!rgb)
            continue;
        const cell = rgb.map((n) => String(n).padStart(3, " ")).join(" ");
        out.push(colorName ? `${cell}\t${colorName}` : cell);
    }
    return out.join("\n") + "\n";
}
// ---- color family grouping -------------------------------------------
//
// The .gpl format carries no grouping. To show a flat palette organized, bucket
// each color into a hue family derived from its HSL: chromatic colors fall into
// a hue band, while low-saturation / near-black / near-white colors collect as
// Neutral (their hue is meaningless). Shared so every app that displays a
// palette groups it identically and uses the same family labels.
/** Fixed display order; render-time, empty families are dropped. */
export const FAMILY_ORDER = [
    "Red", "Orange", "Yellow", "Green", "Cyan", "Blue", "Purple", "Pink", "Neutral",
];
/** Which family a 0–255 RGB triple belongs to. */
export function familyOf(r, g, b) {
    const { h, s, l } = rgbToHsl(r, g, b);
    if (s < 12 || l < 6 || l > 97)
        return "Neutral";
    if (h < 15 || h >= 345)
        return "Red";
    if (h < 45)
        return "Orange";
    if (h < 65)
        return "Yellow";
    if (h < 150)
        return "Green";
    if (h < 195)
        return "Cyan";
    if (h < 255)
        return "Blue";
    if (h < 290)
        return "Purple";
    return "Pink";
}
/** Like `familyOf` but from a hex string; unparseable hex falls to Neutral. */
export function familyOfHex(hex) {
    const rgb = hexToRgb(hex);
    return rgb ? familyOf(rgb[0], rgb[1], rgb[2]) : "Neutral";
}
// HSL with h in [0,360), s and l in [0,100] — the ranges familyOf's cutoffs
// assume.
function rgbToHsl(r, g, b) {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0)
        return { h: 0, s: 0, l: l * 100 };
    const s = d / (1 - Math.abs(2 * l - 1));
    let h;
    if (max === rn)
        h = ((gn - bn) / d) % 6;
    else if (max === gn)
        h = (bn - rn) / d + 2;
    else
        h = (rn - gn) / d + 4;
    h = (h * 60 + 360) % 360;
    return { h, s: s * 100, l: l * 100 };
}
//# sourceMappingURL=palette.js.map