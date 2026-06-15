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
/** Parse GIMP Palette text. Lenient: a missing magic line, stray comments, or
 *  malformed color rows are tolerated — only well-formed `R G B [name]` rows
 *  become colors. */
export declare function parseGpl(text: string): Palette;
export interface SerializeGplOptions {
    name?: string;
    columns?: number;
    colors: Array<PaletteColor | string>;
}
/** Serialize colors to GIMP Palette text. Accepts `{ hex, name? }` objects or
 *  bare hex strings. */
export declare function serializeGpl(opts: SerializeGplOptions): string;
//# sourceMappingURL=palette.d.ts.map