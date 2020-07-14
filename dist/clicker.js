/** Handle mouse events, for example clicks. */
export class Clicker {
    constructor(game) {
        this._game = game;
    }
    onMouseDown(cell) {
        this._cells = [];
        this._cells.push(cell);
        this.onStart(cell);
    }
    onMouseMove(cell) {
        if (this._cells !== undefined) {
            // Prevent adding the same cell twice.
            const lastCell = this._cells[this._cells.length - 1];
            if (!lastCell.isSame(cell)) {
                this._cells.push(cell);
            }
            this.onContinue(cell);
        }
    }
    onMouseUp(cell) {
        this.onStop(cell);
        this._cells = undefined;
        this._game.restorePoint();
    }
}
//# sourceMappingURL=clicker.js.map