import { GridCell } from "./grid-cell.js";

export class MicroIterator {
    public readonly cell: GridCell;

    constructor(cell: GridCell) {
        this.cell = cell;
    }

    public forEach(cb: (cell: GridCell) => void): void {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                const cell = new GridCell(this.cell.x + x, this.cell.y + y);
                cb(cell);
            }
        }        
    }

}