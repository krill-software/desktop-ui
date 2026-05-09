import { buildTitlebar } from "./titlebar.js";
import { installMenuBar } from "./menu.js";
import type { ChromeRefs, MountChromeOptions } from "./types.js";

/** Build and mount the standard krill app chrome — titlebar, optional
 *  status line, viewport — into a parent (default `document.body`).
 *  Returns refs the app uses to populate dynamic content (filename,
 *  status indicators) and to render its working view (`viewport`). */
export function mountChrome(opts: MountChromeOptions): ChromeRefs {
  const parent = opts.parent ?? document.body;

  // Clear any existing chrome the caller may have left in HTML.
  parent.replaceChildren();

  const { titlebar, title, menuBar } = buildTitlebar();
  parent.appendChild(titlebar);

  const viewport = document.createElement("main");
  viewport.id = "viewport";
  parent.appendChild(viewport);

  let statusLine: HTMLElement | null = null;
  if (opts.showStatusLine) {
    statusLine = document.createElement("footer");
    statusLine.id = "status-line";
    statusLine.setAttribute("aria-live", "polite");
    parent.appendChild(statusLine);
  }

  title.textContent = opts.productName;
  if (opts.menus.length > 0) installMenuBar(menuBar, opts.menus);

  return { title, menuBar, statusLine, viewport };
}
