import { GridCell } from "./grid-cell.js";
export class MicroIterator {
    constructor(cell) {
        this.cell = cell;
    }
    forEach(cb) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                const cell = new GridCell(this.cell.x + x, this.cell.y + y);
                cb(cell);
            }
        }
    }
}
//# sourceMappingURL=micro-iterator.js.map