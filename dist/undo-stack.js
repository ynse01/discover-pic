import { SaveGame } from "./save-game.js";
import { GridIterator } from "./grid-iterator.js";
export class UndoStack {
    constructor(grid) {
        this.stack = [];
        this.index = -1;
        this._grid = grid;
    }
    save() {
        this.index++;
        if (this.stack.length > this.index) {
            // Chop the tail off.
            this.stack = this.stack.slice(0, this.index);
        }
        this.stack.push(SaveGame.fromGrid(this._grid));
    }
    undo() {
        if (this.index >= 1) {
            this.index--;
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }
    redo() {
        if (this.index < (this.stack.length - 1)) {
            this.index++;
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }
    refreshGrid() {
        var iterator = new GridIterator(this._grid);
        iterator.forEach((cell) => {
            // Force change handler to run.
            this._grid.setStatus(cell, this._grid.getStatus(cell));
        });
    }
}
//# sourceMappingURL=undo-stack.js.map