//! Shared filter / search input.
//!
//! Case-insensitive substring search styled to the locked palette,
//! pinned to the bundled mono so every krill list filter looks
//! identical. The element is a plain `<input type="search">`; consumers
//! own the filtering itself — this just provides the visual.
export function buildFilterInput(opts) {
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
//# sourceMappingURL=filter-input.js.map