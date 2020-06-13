import { Grid } from "./grid.js";

export class GridIterator {
    private _grid: Grid;

    constructor(grid: Grid) {
        this._grid = grid;
    }

    public forEach(cb: (x: number, y: number) => void): void {
        for (let y = 0; y < this._grid.numRows; y++) {
            for(let x = 0; x < this._grid.numCols; x++) {
                cb(x, y);
            }
        }        
    }
}