import { Grid } from "./grid.js";
import { BlockIterator } from "./block-iterator.js";

export class Solver {
    private _grid: Grid;

    constructor(grid: Grid) {
        this._grid = grid;
    }

    public solve(): void {
        let previousCount = this._countBlocks() + 1;
        let count = previousCount - 1;
        while(count < previousCount) {
            this._applyTrivialBlocks();
            previousCount = count;
            count = this._countOpenBlocks();
        }
        console.log(`${count} hints still open.`);
    }

    private _applyTrivialBlocks(): void {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                block.applyHint(false);
            }
        });
    }

    private _countBlocks(): number {
        let count = 0;
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(_block => {
            count++;
        });
        return count;
    }

    private _countOpenBlocks(): number {
        let count = 0;
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                count++;
            }
        });
        return count;
    }
}