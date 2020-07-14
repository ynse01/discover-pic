import { CellStatus } from "./grid.js";
import { GridCell } from "./grid-cell.js";
import { IGame } from "./i-game.js";

/** Handle mouse events, for example clicks. */
export class Clicker {
    private _game: IGame;
    private _onCellClickHandler: (cell: GridCell) => void;
    private _cells: GridCell[] | undefined;
    private _startStatus: CellStatus | undefined;
    private _status: CellStatus | undefined;

    constructor(game: IGame, cellClickHandler: (cell: GridCell) => void) {
        this._game = game;
        this._onCellClickHandler = cellClickHandler;
    }

    public onMouseDown(cell: GridCell): void {
        this._cells = [];
        this._cells.push(cell);
        this._startStatus = this._game.grid.getStatus(cell);
        this._status = this._game.grid.toggleStatus(cell);
    }

    public onMouseMove(cell: GridCell): void {
        if (this._cells !== undefined) {
            // Prevent adding the same cell twice.
            const lastCell = this._cells[this._cells.length - 1];
            if (!lastCell.isSame(cell)) {
                this._cells.push(cell);
            }
            this._cells.forEach(cell => {
                this._game.grid.setStatus(cell, this._status!);
            });
        }
    }

    public onMouseUp(cell: GridCell | undefined): void {
        const isClick = this._cells === undefined || this._cells.length === 1;
        if (isClick) {
            const clickedCell = (this._cells) ? this._cells[0] : cell;
            if (clickedCell !== undefined) {       
                this._game.grid.setStatus(clickedCell, this._startStatus!);    
                this._onCellClickHandler(clickedCell);
            }
        } else if (cell !== undefined) {
            this.onMouseMove(cell);
        }
        this._cells = undefined;
        this._game.restorePoint();
    }
}