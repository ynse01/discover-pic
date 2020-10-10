import { Clicker } from "./clicker.js";
import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";
import { IGame } from "./i-game.js";

export class EditorClicker extends Clicker {
    private appliedStatus: CellStatus = CellStatus.Unknown;

    constructor(game: IGame) {
        super(game);
    }

    protected onStart(cell: GridCell): void {
        var status = this._game.grid.getStatus(cell);
        switch (status) {
            case CellStatus.Unknown:
            case CellStatus.Empty:
                this.appliedStatus = CellStatus.Full;
                break;
            case CellStatus.Full:
                this.appliedStatus = CellStatus.Empty;
                break;
        }
    }

    protected onContinue(_cell: GridCell): void {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                var block = this._game.grid.getBlock(cell)!;
                if (block.hint >= 0) {
                    block.toggleHint();
                }
                this._game.grid.setStatus(cell, this.appliedStatus);
            });
        }
    }

    protected onStop(cell: GridCell | undefined): void {
        if (cell !== undefined) {
            this.onContinue(cell);
        }
    }
    
}