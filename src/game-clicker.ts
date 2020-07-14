import { Clicker } from "./clicker.js";
import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";
import { IGame } from "./i-game.js";

export class GameClicker extends Clicker {
    private _status: CellStatus | undefined;

    constructor(game: IGame) {
        super(game);
    }

    protected onStart(cell: GridCell): void {
        this._status = this._game.grid.toggleStatus(cell);
    }
    protected onContinue(_cell: GridCell): void {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                this._game.grid.setStatus(cell, this._status!);
            });
        }
    }

    protected onStop(_cell: GridCell | undefined): void {
        // Nothing to do
    }
    
}