export interface DropZoneOptions {
    /** Primary line. Defaults to "Drop a file here". */
    label?: string;
    /** Secondary line under the label. Defaults to "or click to browse". Pass
     *  an empty string to omit it. */
    hint?: string;
    /** Replace the default upload glyph with your own icon element (e.g. an
     *  app-specific stroke icon). */
    icon?: SVGElement | HTMLElement;
    /** Fired on click or keyboard activation — open your file dialog here. */
    onActivate: () => void;
}
export interface DropZoneRefs {
    /** The clickable zone — append it where the empty-load state should live. */
    element: HTMLButtonElement;
    /** Light up (or clear) the drag-over visual. Wire to your platform's
     *  drag-enter / drag-leave events for live feedback; purely cosmetic. */
    setDragActive(active: boolean): void;
}
export declare function buildDropZone(opts: DropZoneOptions): DropZoneRefs;
//# sourceMappingURL=drop-zone.d.ts.map