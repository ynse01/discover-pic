import { Block } from "./block.js";
import { Grid } from "./grid.js";
import { GridCell } from "./grid-cell.js";

export class NeighborIterator {
    private _grid: Grid;
    public readonly cell: GridCell;

    constructor(grid: Grid, cell: GridCell) {
        this._grid = grid;
        this.cell = cell;
    }

    public forEach(cb: (block: Block) => void): void {
        for (let y = -2; y <= 2; y++) {
            for(let x = -2; x <= 2; x++) {
                const cell = new GridCell(this.cell.x + x, this.cell.y + y);
                const block = this._grid.getBlock(cell);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }
    }
}