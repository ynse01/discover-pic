import { Grid } from "./grid.js";

export interface IGame {
    readonly grid: Grid;

    load(url: string): void;

    toggleCursor(): boolean;

    saveGame(): void;

    restorePoint(): void;

    undo(): void;
    
    redo(): void;

    check(): void;

    clear(): void;

    solve(): void;
}

