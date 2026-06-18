/* Light / dark theme control for the titlebar.
 *
 * krill apps follow the OS color scheme by default (palette.css drives the
 * inversion through `@media (prefers-color-scheme)`). This module adds the
 * manual override: a titlebar toggle that flips the *visible* theme and
 * remembers the choice per app. The choice is an explicit attribute on
 * <html> — `data-theme="light" | "dark"` — which palette.css honors over the
 * media query. No stored choice ⇒ no attribute ⇒ system-following, unchanged.
 *
 * Persistence is localStorage (per-app origin), so a user's choice is that
 * app's alone — there is no global setting and no settings panel. */
const STORAGE_KEY = "krill-theme";
/* Lucide-style "contrast" glyph: a circle with its left half filled. One
 * constant icon for the toggle (like min/max/close, it doesn't swap on state),
 * drawn on the same 12px grid and `currentColor` as the sibling controls. */
export const THEME_TOGGLE_SVG = `<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
  <circle cx="6" cy="6" r="4.25" fill="none" stroke="currentColor" stroke-width="1.2"/>
  <path d="M6 1.75a4.25 4.25 0 0 0 0 8.5z" fill="currentColor"/>
</svg>`;
function storedChoice() {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === "light" || v === "dark" ? v : null;
    }
    catch {
        return null;
    }
}
function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
/** The theme actually on screen: an explicit override if the user set one,
 *  otherwise whatever the OS is currently asking for. */
export function effectiveTheme() {
    return storedChoice() ?? systemTheme();
}
/** Apply the persisted choice (if any) to <html data-theme>. Call once, as
 *  early as possible, so an overridden app doesn't flash the system theme.
 *  With no stored choice the attribute stays off and the media query rules. */
export function initTheme() {
    const choice = storedChoice();
    if (choice)
        document.documentElement.dataset.theme = choice;
    else
        delete document.documentElement.dataset.theme;
}
/** Flip the visible theme and persist it as an explicit override. Returns the
 *  new theme. */
function toggleTheme() {
    const next = effectiveTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
        localStorage.setItem(STORAGE_KEY, next);
    }
    catch {
        /* private mode / storage disabled — the toggle still works this session */
    }
    return next;
}
function actionLabel(current) {
    return current === "dark" ? "Switch to light mode" : "Switch to dark mode";
}
/** Wire a caller-built button to the theme toggle. The caller owns the
 *  button's element + classes (so it matches its layout's other controls);
 *  this sets the accessible label to the *action* and flips on click. */
export function wireThemeToggle(btn) {
    const sync = () => {
        const label = actionLabel(effectiveTheme());
        btn.setAttribute("aria-label", label);
        btn.title = label;
    };
    sync();
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        toggleTheme();
        sync();
    });
    // While the app is still system-following, keep the label honest as the OS
    // flips underneath us.
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", sync);
}
//# sourceMappingURL=theme.js.map