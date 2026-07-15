//! Shared text search input for editors.
//!
//! Provides a search box that can be toggled with Ctrl+F and integrated
//! into text editors like CodeMirror. Consumers handle the actual search
//! and highlighting logic — this provides the UI container.

export interface TextSearchRefs {
  /** The root container for the search box. */
  element: HTMLDivElement;
  /** The search input field. */
  input: HTMLInputElement;
  /** Close the search box. */
  close: () => void;
  /** Open/show the search box and focus the input. */
  open: () => void;
}

export interface TextSearchOptions {
  /** Called when search value changes. */
  onChange?: (value: string) => void;
  /** Called when the input is closed (Escape or close button). */
  onClose?: () => void;
  /** Initial value. Defaults to empty string. */
  value?: string;
}

export function buildTextSearch(opts: TextSearchOptions = {}): TextSearchRefs {
  const container = document.createElement("div");
  container.className = "fm-text-search";
  container.style.display = "none";

  const input = document.createElement("input");
  input.className = "fm-text-search-input";
  input.type = "text";
  input.placeholder = "Search…";
  input.value = opts.value ?? "";
  input.spellcheck = false;
  input.autocomplete = "off";

  input.addEventListener("input", () => {
    opts.onChange?.(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
    }
  });

  const closeBtn = document.createElement("button");
  closeBtn.className = "fm-text-search-close";
  closeBtn.setAttribute("aria-label", "Close search");
  closeBtn.innerHTML = "×";
  closeBtn.addEventListener("click", close);

  container.append(input, closeBtn);

  function close() {
    container.style.display = "none";
    opts.onClose?.();
  }

  function open() {
    container.style.display = "flex";
    input.focus();
    input.select();
  }

  return { element: container, input, close, open };
}
