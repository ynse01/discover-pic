import { Grid } from "./grid.js"
import { SaveGame } from "./save-game.js";
import { GridIterator } from "./grid-iterator.js";

export class UndoStack {
    private _grid: Grid;
    private stack: SaveGame[] = [];
    private index = -1;

    constructor(grid: Grid) {
        this._grid = grid;
    }

    public save(): void {
        this.index++;
        if (this.stack.length > this.index) {
            // Chop the tail off.
            this.stack = this.stack.slice(0, this.index);
        }
        this.stack.push(SaveGame.fromGrid(this._grid));
    }

    public undo(): void {
        if (this.index >= 1) {
            this.index--;
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }

    public redo(): void {
        if (this.index < (this.stack.length - 1)) {
            this.index++;
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }

    private refreshGrid(): void {
        var iterator = new GridIterator(this._grid);
        iterator.forEach((cell) => {
            // Force change handler to run.
            this._grid.setStatus(cell, this._grid.getStatus(cell));
        });
    }
}