import { Block } from "./block.js";
import { Grid } from "./grid.js";

export class NeighborIterator {
    private _grid: Grid;
    public readonly x: number;
    public readonly y: number;

    constructor(grid: Grid, x: number, y: number) {
        this._grid = grid;
        this.x = x;
        this.y = y;
    }

    public forEach(cb: (block: Block) => void): void {
        for (let y = -2; y <= 2; y++) {
            for(let x = -2; x <= 2; x++) {
                const block = this._grid.getBlock(this.x + x, this.y + y);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }
    }
}