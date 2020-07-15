import { Clicker } from "./clicker.js";
export class EditorClicker extends Clicker {
    constructor(game) {
        super(game);
        this._startVisibility = undefined;
    }
    onStart(cell) {
        this._startVisibility = this._game.grid.getBlock(cell).hint >= 0;
    }
    onContinue(_cell) {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                var block = this._game.grid.getBlock(cell);
                if (this._startVisibility) {
                    if (block.hint >= 0) {
                        block.toggleHint();
                    }
                }
                else {
                    if (block.hint < 0) {
                        block.toggleHint();
                    }
                }
                // Force change handler to run.
                this._game.grid.setStatus(cell, this._game.grid.getStatus(cell));
            });
        }
    }
    onStop(cell) {
        if (cell !== undefined) {
            this.onContinue(cell);
        }
    }
}
//# sourceMappingURL=editor-clicker.js.map