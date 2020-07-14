import { GridCell } from "./grid-cell.js";
export class GridIterator {
    constructor(grid) {
        this._grid = grid;
    }
    forEach(cb) {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                cb(new GridCell(x, y));
            }
        }
    }
}
//# sourceMappingURL=grid-iterator.js.map