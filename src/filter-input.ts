//! Shared filter / search input.
//!
//! Case-insensitive substring search styled to the locked palette,
//! pinned to the bundled mono so every krill list filter looks
//! identical. The element is a plain `<input type="search">`; consumers
//! own the filtering itself — this just provides the visual.

export interface FilterInputRefs {
  /** The wrapping row — append to wherever the filter should live. */
  element: HTMLDivElement;
  /** The actual `<input>`. Use this for focus / selection management
   *  when re-rendering. */
  input: HTMLInputElement;
}

export interface FilterInputOptions {
  /** Initial value. Defaults to empty string. */
  value?: string;
  /** Placeholder. Defaults to "Filter…". */
  placeholder?: string;
  /** Called on every keystroke with the input's current value. */
  onChange: (value: string) => void;
}

export function buildFilterInput(opts: FilterInputOptions): FilterInputRefs {
  const row = document.createElement("div");
  row.className = "fm-filter-row";

  const input = document.createElement("input");
  input.className = "fm-filter-input";
  input.type = "search";
  input.placeholder = opts.placeholder ?? "Filter…";
  input.value = opts.value ?? "";
  input.spellcheck = false;
  input.autocomplete = "off";
  input.addEventListener("input", () => opts.onChange(input.value));
  row.append(input);

  return { element: row, input };
}
