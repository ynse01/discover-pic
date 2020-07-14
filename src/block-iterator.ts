import { Grid } from "./grid.js";
import { Block } from "./block.js";
import { GridCell } from "./grid-cell.js";

export class BlockIterator {
    private _grid: Grid;

    constructor(grid: Grid) {
        this._grid = grid;
    }

    public forEach(cb: (item: Block) => void): void {
        for (let y = 0; y < this._grid.numRows; y++) {
            for(let x = 0; x < this._grid.numCols; x++) {
                const cell = new GridCell(x, y);
                const block = this._grid.getBlock(cell);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }        
    }
}