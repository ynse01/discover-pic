import { Clicker } from "./clicker.js";
export class GameClicker extends Clicker {
    constructor(game) {
        super(game);
    }
    onStart(cell) {
        this._status = this._game.grid.toggleStatus(cell);
    }
    onContinue(_cell) {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                this._game.grid.setStatus(cell, this._status);
            });
        }
    }
    onStop(_cell) {
        // Nothing to do
    }
}
//# sourceMappingURL=game-clicker.js.map