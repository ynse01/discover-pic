import { Clicker } from "./clicker.js";
import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";
import { IGame } from "./i-game.js";
import { MicroIterator } from "./micro-iterator.js";
import { Block } from "./block.js";

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
        // Update applied status.
        this._updateApplied();
    }
    
    private _updateApplied(): void {
        const blocks: Block[] = [];
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