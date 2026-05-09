// Tiny shortcut parser + matcher. Handles the shortcut grammar used in the
// canonical action registry: "Ctrl+S", "Ctrl+Shift+S", "F", "F11",
// "ArrowLeft", "Home", "Ctrl+\\", "Ctrl+=" / "Ctrl+-".

export interface ParsedShortcut {
  mod: boolean;     // Ctrl OR Meta (we treat them interchangeably for cross-OS)
  shift: boolean;
  alt: boolean;
  /** Single-character keys are stored lowercased; multi-character names
   *  ("ArrowLeft", "Home", "F11") are preserved verbatim and matched
   *  case-sensitively against `e.key`. */
  key: string;
}

export function parseShortcut(s: string): ParsedShortcut {
  const parts = s.split("+");
  const last = parts[parts.length - 1];
  return {
    mod:   parts.some(p => p === "Ctrl" || p === "Meta" || p === "Cmd"),
    shift: parts.some(p => p === "Shift"),
    alt:   parts.some(p => p === "Alt"),
    key:   last.length === 1 ? last.toLowerCase() : last,
  };
}

export function matchShortcut(e: KeyboardEvent, p: ParsedShortcut): boolean {
  if (p.mod !== (e.ctrlKey || e.metaKey)) return false;
  if (p.shift !== e.shiftKey) return false;
  if (p.alt !== e.altKey) return false;
  if (p.key.length === 1) {
    const ek = e.key.toLowerCase();
    // "Ctrl+=" can fire as "+" on shift+= layouts.
    if (p.key === "=" && (ek === "=" || ek === "+")) return true;
    return ek === p.key;
  }
  return e.key === p.key;
}

export function isTextTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable;
}
