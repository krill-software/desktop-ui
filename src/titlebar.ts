import { getCurrentWindow } from "@tauri-apps/api/window";
import { THEME_TOGGLE_SVG, wireThemeToggle } from "./theme.js";

// `#titlebar-title` is a sibling of the drag region, not a child — that way
// it can be absolute-positioned at the visual center of the *full* titlebar
// instead of just the middle flex slot.
const TITLEBAR_HTML = `
<header id="titlebar">
  <nav id="menu-bar"></nav>
  <div id="titlebar-drag" data-tauri-drag-region></div>
  <span id="titlebar-title"></span>
  <div id="titlebar-controls">
    <button id="titlebar-theme" type="button" aria-label="Toggle theme" title="Toggle theme">
      ${THEME_TOGGLE_SVG}
    </button>
    <button id="titlebar-min" type="button" aria-label="Minimize" title="Minimize">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </button>
    <button id="titlebar-max" type="button" aria-label="Maximize" title="Maximize">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <rect x="2.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.2"/>
      </svg>
    </button>
    <button id="titlebar-close" type="button" aria-label="Close" title="Close">
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
        <line x1="3" y1="3" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="9" y1="3" x2="3" y2="9" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</header>
`;

/** Build the titlebar DOM and wire its window-control buttons.
 *  Returns the title `<span>` and the menu-bar container, ready for the
 *  caller to populate with the active filename and menu definitions. */
export function buildTitlebar(): { titlebar: HTMLElement; title: HTMLElement; menuBar: HTMLElement } {
  const tpl = document.createElement("template");
  tpl.innerHTML = TITLEBAR_HTML.trim();
  const titlebar = tpl.content.firstElementChild as HTMLElement;

  const title = titlebar.querySelector("#titlebar-title") as HTMLElement;
  const menuBar = titlebar.querySelector("#menu-bar") as HTMLElement;

  const w = getCurrentWindow();
  const bind = (el: Element | null, h: () => void | Promise<void>) => {
    if (!el) return;
    el.addEventListener("click", (e) => {
      e.preventDefault();
      void h();
    });
  };
  const themeBtn = titlebar.querySelector("#titlebar-theme");
  if (themeBtn) wireThemeToggle(themeBtn as HTMLElement);
  bind(titlebar.querySelector("#titlebar-min"), () => w.minimize());
  bind(titlebar.querySelector("#titlebar-max"), async () =>
    (await w.isMaximized()) ? w.unmaximize() : w.maximize(),
  );
  bind(titlebar.querySelector("#titlebar-close"), () => w.close());
  titlebar.querySelector("#titlebar-drag")?.addEventListener("dblclick", async () =>
    (await w.isMaximized()) ? w.unmaximize() : w.maximize(),
  );

  return { titlebar, title, menuBar };
}
