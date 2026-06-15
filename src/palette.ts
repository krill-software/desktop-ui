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

export interface PaletteColor {
  /** "#rrggbb", lowercase. */
  hex: string;
  /** Optional swatch name (the text after the RGB triple). */
  name?: string;
}

export interface Palette {
  name: string;
  columns: number;
  colors: PaletteColor[];
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) => clampByte(n).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex.trim());
  if (m) return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  const s = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(hex.trim());
  if (s) {
    return [parseInt(s[1] + s[1], 16), parseInt(s[2] + s[2], 16), parseInt(s[3] + s[3], 16)];
  }
  return null;
}

/** Parse GIMP Palette text. Lenient: a missing magic line, stray comments, or
 *  malformed color rows are tolerated — only well-formed `R G B [name]` rows
 *  become colors. */
export function parseGpl(text: string): Palette {
  const lines = text.split(/\r?\n/);
  let name = "";
  let columns = 0;
  const colors: PaletteColor[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (i === 0 && /^GIMP Palette/i.test(trimmed)) continue;
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const nameHeader = /^Name:\s*(.*)$/i.exec(trimmed);
    if (nameHeader) { name = nameHeader[1].trim(); continue; }
    const colHeader = /^Columns:\s*(\d+)/i.exec(trimmed);
    if (colHeader) { columns = parseInt(colHeader[1], 10); continue; }

    // A color row: three integers, then an optional name (the rest of the line).
    const m = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})(?:\s+(.*))?$/.exec(trimmed);
    if (!m) continue;
    const hex = rgbToHex(parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10));
    const colorName = m[4]?.trim();
    colors.push(colorName ? { hex, name: colorName } : { hex });
  }

  return { name, columns, colors };
}

export interface SerializeGplOptions {
  name?: string;
  columns?: number;
  colors: Array<PaletteColor | string>;
}

/** Serialize colors to GIMP Palette text. Accepts `{ hex, name? }` objects or
 *  bare hex strings. */
export function serializeGpl(opts: SerializeGplOptions): string {
  const name = opts.name?.trim() || "krill palette";
  const columns = opts.columns ?? 0;
  const out = ["GIMP Palette", `Name: ${name}`, `Columns: ${columns}`, "#"];
  for (const c of opts.colors) {
    const hex = typeof c === "string" ? c : c.hex;
    const colorName = typeof c === "string" ? undefined : c.name;
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const cell = rgb.map((n) => String(n).padStart(3, " ")).join(" ");
    out.push(colorName ? `${cell}\t${colorName}` : cell);
  }
  return out.join("\n") + "\n";
}
