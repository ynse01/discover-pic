import { Clicker } from "./clicker.js";
import { MicroIterator } from "./micro-iterator.js";
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
        // Update applied status.
        this._updateApplied();
    }
    _updateApplied() {
        const blocks = [];
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                const iterator = new MicroIterator(cell);
                iterator.forEach(neighbor => {
                    const block = this._game.grid.getBlock(neighbor);
                    if (block !== undefined && !blocks.includes(block)) {
                        blocks.push(block);
                    }
                });
            });
        }
        blocks.forEach(block => {
            const previousState = block.applied;
            const newState = block.checkApplied();
            if (previousState !== newState) {
                // Refresh the state
                this._game.grid.setStatus(block.cell, this._game.grid.getStatus(block.cell));
            }
        });
    }
}
//# sourceMappingURL=game-clicker.js.map