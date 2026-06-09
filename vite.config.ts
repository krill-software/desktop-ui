import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

/* Dev server for the in-repo chrome examples (see examples/).
 *
 * These are NOT shipped — package.json#files ships only dist + src/styles.
 * They import desktop-ui straight from ./src, so whatever you edit in
 * src/styles or src/*.ts is what you see, live. No version pin, no tag:
 * the examples always reflect the current chrome/style.
 *
 *   pnpm examples        # dev server with HMR
 *   pnpm examples:build  # sanity build into .examples-dist/
 */

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  root: r("./examples"),
  resolve: {
    alias: {
      // Stub Tauri's window API so the titlebar mounts in the browser.
      "@tauri-apps/api/window": r("./examples/_tauri-stub.ts"),
    },
  },
  server: {
    // Allow serving desktop-ui's ./src (and its bundled woff2) from above root.
    fs: { allow: [r(".")] },
  },
  build: {
    outDir: r("./.examples-dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: r("./examples/index.html"),
        quiet: r("./examples/quiet.html"),
        aux: r("./examples/aux.html"),
        app: r("./examples/app.html"),
        components: r("./examples/components.html"),
      },
    },
  },
});
