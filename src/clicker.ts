import { GridCell } from "./grid-cell.js";
import { IGame } from "./i-game.js";


/** Handle mouse events, for example clicks. */
export abstract class Clicker {
    protected _game: IGame;
    protected _cells: GridCell[] | undefined;

    constructor(game: IGame) {
        this._game = game;
    }

    public onMouseDown(cell: GridCell): void {
        this._cells = [];
        this._cells.push(cell);
        this.onStart(cell);
    }

    public onMouseMove(cell: GridCell): void {
        if (this._cells !== undefined) {
            // Prevent adding the same cell twice.
            const lastCell = this._cells[this._cells.length - 1];
            if (!lastCell.isSame(cell)) {
                this._cells.push(cell);
            }
            this.onContinue(cell);
        }
    }

    public onMouseUp(cell: GridCell | undefined): void {
        this.onStop(cell);
        this._cells = undefined;
        this._game.restorePoint();
    }

    protected abstract onStart(cell: GridCell): void;
    protected abstract onContinue(cell: GridCell): void;
    protected abstract onStop(cell: GridCell | undefined): void;
}