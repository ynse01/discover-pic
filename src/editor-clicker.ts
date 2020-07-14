import { Clicker } from "./clicker.js";
import { GridCell } from "./grid-cell.js";
import { IGame } from "./i-game.js";

export class EditorClicker extends Clicker {
    private _startVisibility: boolean | undefined = undefined;
    
    constructor(game: IGame) {
        super(game);
    }

    protected onStart(cell: GridCell): void {
        this._startVisibility = this._game.grid.getBlock(cell)!.hint >= 0;
    }

    protected onContinue(_cell: GridCell): void {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                var block = this._game.grid.getBlock(cell)!;
                if (this._startVisibility) {
                    if (block.hint >= 0) {
                        block.toggleHint();
                    }
                } else {
                    if (block.hint < 0) {
                        block.toggleHint();
                    }
                }
                // Force change handler to run.
                this._game.grid.setStatus(cell, this._game.grid.getStatus(cell));
            });
        }
    }

    protected onStop(cell: GridCell | undefined): void {
        if (cell !== undefined) {
            this.onContinue(cell);
        }
    }
    
}