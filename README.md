# @krill-software/desktop-ui

Shared UI primitives for [krill-software](https://github.com/krill-software) desktop apps. Locked palette, custom titlebar, canonical action registry (menus + shortcuts), status line.

## What's in here

- **CSS bundle** — palette variables (5 named colors + Space-Cadet alpha rules), base reset, titlebar, menu bar, optional status line, `kbd` styling, opt-in scrollbars.
- **`mountChrome()`** — one call that builds the titlebar DOM, wires window controls (incl. a light/dark theme toggle that defaults to system-following and persists a per-app override), generates the menu bar from the canonical action registry, wires keyboard shortcuts, and (optionally) adds a status line. Returns refs the app uses to populate dynamic content.
- **`ACTION_REGISTRY`** — single source of truth for the label, shortcut, and menu group of every krill-canonical action (Save = Ctrl+S, Open = Ctrl+O, Fullscreen = F, etc.). Apps register *callbacks*; everything else is owned by the package.

## Install

```sh
pnpm add github:krill-software/desktop-ui#v0.2.0
pnpm add @tauri-apps/api  # peer dep
```

## Use — the canonical action API

Every shortcut + menu structure across krill apps is centralized. An app declares which actions it implements; the package handles everything else.

```ts
// main.ts
import "@krill-software/desktop-ui/styles";
import { mountChrome } from "@krill-software/desktop-ui";

const chrome = mountChrome({
  productName: "Document Viewer",

  // Canonical actions — package owns the label, shortcut, and menu group;
  // app provides the callback. `close-window` and `quit` are auto-included.
  actions: {
    "open":           openViaDialog,
    "fullscreen":     toggleFullscreen,
    "toggle-sidebar": toggleSidebar,
    "previous":       () => goToPage(state.pageNumber - 1),
    "next":           () => goToPage(state.pageNumber + 1),
    "first":          () => goToPage(1),
    "last":           () => goToPage(state.totalPages),
  },

  // App-specific items appended to canonical menu groups.
  customMenu: [
    { group: "view", items: [{ label: "Reset zoom history", action: resetZoomHistory }] },
  ],

  // Arbitrary keyboard shortcuts that don't surface in any menu.
  bindings: {
    "PageUp":   () => goToPage(state.pageNumber - 1),
    "PageDown": () => goToPage(state.pageNumber + 1),
  },

  showStatusLine: true,
});

chrome.title.textContent = "paper.pdf — Document Viewer";
chrome.viewport.appendChild(myCanvas);
chrome.statusLine?.appendChild(myPositionEl);
```

The app's `index.html` is a one-script-tag stub:

```html
<body>
  <script type="module" src="/src/main.ts"></script>
</body>
```

## The action set

| ID | Label | Shortcut | Group |
|---|---|---|---|
| `new` | New | `Ctrl+N` | File |
| `open` | Open… | `Ctrl+O` | File |
| `save` | Save | `Ctrl+S` | File |
| `save-as` | Save As… | `Ctrl+Shift+S` | File |
| `close-window` | Close window | `Ctrl+W` | File |
| `quit` | Quit | `Ctrl+Q` | File |
| `undo` | Undo | `Ctrl+Z` | Edit |
| `redo` | Redo | `Ctrl+Shift+Z` | Edit |
| `cut` | Cut | `Ctrl+X` | Edit |
| `copy` | Copy | `Ctrl+C` | Edit |
| `paste` | Paste | `Ctrl+V` | Edit |
| `select-all` | Select all | `Ctrl+A` | Edit |
| `zoom-in` | Zoom in | `Ctrl+=` | View |
| `zoom-out` | Zoom out | `Ctrl+-` | View |
| `zoom-fit` | Fit to window | `Ctrl+0` | View |
| `zoom-actual` | Original size | `Ctrl+1` | View |
| `fullscreen` | Fullscreen | `F` | View |
| `toggle-sidebar` | Toggle sidebar | `Ctrl+\` | View |
| `previous` | Previous | `←` | Go |
| `next` | Next | `→` | Go |
| `first` | First | `Home` | Go |
| `last` | Last | `End` | Go |

If your app needs a sixth keyboard convention (a brand-new shortcut/label combination not in the registry), it's a real decision — propose extending the registry rather than working around with `bindings`. Adding here changes the contract every krill app shares.

### Edit actions defer to text fields

`undo`, `redo`, `cut`, `copy`, `paste`, `select-all` only fire if focus is *not* in a `<textarea>` / `<input>` / contenteditable. Inside a text field, the browser handles them natively. This means CodeMirror inside markdown-editor still gets its own undo, and our package never shadows it.

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

## What's *not* in here

- App-specific layouts (sidebar columns, canvas styling, page rendering). Those vary too much to share.
- Any non-palette colors. See [krill-software/.github/STYLE.md](https://github.com/krill-software/.github/blob/main/STYLE.md) — extending the palette is the user's decision, not the package's.
- Settings / preferences UI — krill apps don't have those.

## Versions

- **v0.2.0** — Canonical action registry; menus and shortcuts derive from action IDs. The pre-v0.2 `menus: MenuDef[]` prop is removed (no compat shim — the org is still early).
- **v0.1.1** — Pre-built `dist/` shipped so consumers don't need to run build scripts on install.
- **v0.1.0** — Initial. CSS + `mountChrome()` + `installMenuBar`.

## License

MIT.
