import { Grid } from "./grid.js";
import { BlockIterator } from "./block-iterator.js";

export class Solver {
    private _grid: Grid;

    constructor(grid: Grid) {
        this._grid = grid;
    }

    public applyTrivialBlocks(): void {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            block.applyHint(false);
        });
    }
}