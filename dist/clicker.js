/** Handle mouse events, for example clicks. */
export class Clicker {
    constructor(game, cellClickHandler) {
        this._game = game;
        this._onCellClickHandler = cellClickHandler;
    }
    onMouseDown(cell) {
        this._cells = [];
        this._cells.push(cell);
        this._startStatus = this._game.grid.getStatus(cell);
        this._status = this._game.grid.toggleStatus(cell);
    }
    onMouseMove(cell) {
        if (this._cells !== undefined) {
            // Prevent adding the same cell twice.
            const lastCell = this._cells[this._cells.length - 1];
            if (!lastCell.isSame(cell)) {
                this._cells.push(cell);
            }
            this._cells.forEach(cell => {
                this._game.grid.setStatus(cell, this._status);
            });
        }
    }
    onMouseUp(cell) {
        const isClick = this._cells === undefined || this._cells.length === 1;
        if (isClick) {
            const clickedCell = (this._cells) ? this._cells[0] : cell;
            if (clickedCell !== undefined) {
                this._game.grid.setStatus(clickedCell, this._startStatus);
                this._onCellClickHandler(clickedCell);
            }
        }
        else if (cell !== undefined) {
            this.onMouseMove(cell);
        }
        this._cells = undefined;
        this._game.restorePoint();
    }
}
//# sourceMappingURL=clicker.js.map