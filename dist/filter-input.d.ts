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
export declare function buildFilterInput(opts: FilterInputOptions): FilterInputRefs;
//# sourceMappingURL=filter-input.d.ts.map