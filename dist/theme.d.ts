export type Theme = "light" | "dark";
export declare const THEME_TOGGLE_SVG = "<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" aria-hidden=\"true\">\n  <circle cx=\"6\" cy=\"6\" r=\"4.25\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.2\"/>\n  <path d=\"M6 1.75a4.25 4.25 0 0 0 0 8.5z\" fill=\"currentColor\"/>\n</svg>";
/** The theme actually on screen: an explicit override if the user set one,
 *  otherwise whatever the OS is currently asking for. */
export declare function effectiveTheme(): Theme;
/** Apply the persisted choice (if any) to <html data-theme>. Call once, as
 *  early as possible, so an overridden app doesn't flash the system theme.
 *  With no stored choice the attribute stays off and the media query rules. */
export declare function initTheme(): void;
/** Wire a caller-built button to the theme toggle. The caller owns the
 *  button's element + classes (so it matches its layout's other controls);
 *  this sets the accessible label to the *action* and flips on click. */
export declare function wireThemeToggle(btn: HTMLElement): void;
//# sourceMappingURL=theme.d.ts.map