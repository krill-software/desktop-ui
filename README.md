# @krill-software/desktop-ui

Shared UI primitives for [krill-software](https://github.com/krill-software) desktop apps. Locked palette, custom titlebar, menu bar, status line.

## What's in here

- **CSS bundle** — palette variables (5 named colors + Space-Cadet alpha rules), base reset, titlebar, menu bar, optional status line, `kbd` styling, opt-in scrollbars. Strict per [STYLE.md](https://github.com/krill-software/.github/blob/main/STYLE.md).
- **`mountChrome()`** — one call that builds the titlebar DOM, wires the window controls, mounts the menu bar, and (optionally) adds a status line. Returns refs the app uses to populate dynamic content.
- **`installMenuBar()`** — used by `mountChrome` internally; also exported for apps that need a menu bar somewhere other than the titlebar.

## Install

```sh
pnpm add github:krill-software/desktop-ui#v0.1.0
pnpm add @tauri-apps/api  # peer dep, you almost certainly already have it
```

Pin a tag (`#v0.1.0`) — `@main` works but won't be reproducible.

## Use

```ts
// main.ts
import "@krill-software/desktop-ui/styles";
import { mountChrome, type MenuDef } from "@krill-software/desktop-ui";

const menus: MenuDef[] = [
  { label: "File", items: [
    { label: "Open…", shortcut: "Ctrl+O", action: () => void openDialog() },
  ]},
];

const chrome = mountChrome({
  productName: "Document Viewer",
  menus,
  showStatusLine: true,
});

// Update the title when a file loads:
chrome.title.textContent = "paper.pdf — Document Viewer";

// Render your working view into the provided viewport:
chrome.viewport.appendChild(myCanvas);

// Append status indicators if you asked for a status line:
chrome.statusLine?.appendChild(myPositionEl);
```

`mountChrome` clears the parent (default `document.body`) before mounting, so the app's `index.html` body can be empty:

```html
<body>
  <script type="module" src="/src/main.ts"></script>
</body>
```

## CSS imports

Top-level entry pulls everything:

```ts
import "@krill-software/desktop-ui/styles";
```

Or cherry-pick:

```ts
import "@krill-software/desktop-ui/styles/palette.css";
import "@krill-software/desktop-ui/styles/titlebar.css";
import "@krill-software/desktop-ui/styles/menu.css";
import "@krill-software/desktop-ui/styles/status-line.css";
import "@krill-software/desktop-ui/styles/kbd.css";
import "@krill-software/desktop-ui/styles/scrollbar.css";  // adds .fm-scroll
```

## Conventions assumed by the package

- The app sets `<body data-fullscreen="true">` to enter chrome-free fullscreen — both `#titlebar` and `#status-line` hide on that selector.
- The app may also use `<body data-state="...">` for application-specific UI states (e.g., `empty` / `document` / `error`); the package doesn't reserve those.
- The app's working-view CSS lives in its own `styles.css`; only chrome and palette belong here.

## What's *not* in here

- App-specific layouts (sidebar columns, page rendering, canvas styling). Those vary too much between apps to share.
- Settings / preferences UI — krill apps don't have settings panels.
- Any non-palette colors. If you find yourself wanting a sixth color, see [STYLE.md](https://github.com/krill-software/.github/blob/main/STYLE.md) — it's the user's call to extend the palette, not the package's.

## License

MIT.
