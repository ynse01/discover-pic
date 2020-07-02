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
        console.log(`Restore point index ${this.index}`);
        if (this.stack.length > this.index) {
            // Chop the tail off.
            this.stack = this.stack.slice(0, this.index);
        }
        this.stack.push(SaveGame.fromGrid(this._grid));
    }
    undo() {
        if (this.index >= 1) {
            this.index--;
            console.log(`Undo to index ${this.index} stack length ${this.stack.length}`);
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }
    redo() {
        if (this.index < (this.stack.length - 1)) {
            this.index++;
            console.log(`Redo to index ${this.index} stack length ${this.stack.length}`);
            var saved = this.stack[this.index];
            SaveGame.loadGame(saved, this._grid);
            this.refreshGrid();
        }
    }
    refreshGrid() {
        var iterator = new GridIterator(this._grid);
        iterator.forEach((x, y) => {
            // Force change handler to run.
            this._grid.setStatus(x, y, this._grid.getStatus(x, y));
        });
    }
}
//# sourceMappingURL=undo-stack.js.map