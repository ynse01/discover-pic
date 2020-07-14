import { GridCell } from "./grid-cell.js";
export class NeighborIterator {
    constructor(grid, cell) {
        this._grid = grid;
        this.cell = cell;
    }
    forEach(cb) {
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                const cell = new GridCell(this.cell.x + x, this.cell.y + y);
                const block = this._grid.getBlock(cell);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }
    }
}
//# sourceMappingURL=neighbor-iterator.js.map