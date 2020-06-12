import { GridCell } from "./grid-cell.js";
import { Grid } from "./grid.js";

export class MicroIterator {
    private _grid: Grid;
    public readonly x: number;
    public readonly y: number;

    constructor(grid: Grid, x: number, y: number) {
        this._grid = grid;
        this.x = x;
        this.y = y;
    }

    public foreach(cb: (cell: GridCell) => void): void {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                const cell = this._grid.getCell(this.x + x, this.y + y);
                if (cell !== undefined) {
                    cb(cell);
                }
            }
        }        
    }

}