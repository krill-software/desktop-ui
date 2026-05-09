export interface ParsedShortcut {
    mod: boolean;
    shift: boolean;
    alt: boolean;
    /** Single-character keys are stored lowercased; multi-character names
     *  ("ArrowLeft", "Home", "F11") are preserved verbatim and matched
     *  case-sensitively against `e.key`. */
    key: string;
}
export declare function parseShortcut(s: string): ParsedShortcut;
export declare function matchShortcut(e: KeyboardEvent, p: ParsedShortcut): boolean;
export declare function isTextTarget(t: EventTarget | null): boolean;
//# sourceMappingURL=keybindings.d.ts.map