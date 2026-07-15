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
export declare function buildTextSearch(opts?: TextSearchOptions): TextSearchRefs;
//# sourceMappingURL=text-search.d.ts.map