import { CellStatus } from "./grid.js";

export class GridCell {
    public readonly x: number;
    public readonly y: number;
    public status: CellStatus;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.status = CellStatus.Unknown;
    }

    public toggleStatus(): CellStatus {
        let newStatus: CellStatus = CellStatus.Unknown;
        const oldStatus = this.status;
        switch(oldStatus) {
            case CellStatus.Unknown:
                newStatus = CellStatus.Full;
                break;
            case CellStatus.Full:
                newStatus = CellStatus.Empty;
                break;
            case CellStatus.Empty:
                newStatus = CellStatus.Unknown;
                break;
        }
        this.status = newStatus;
        return newStatus;
    }

    public clone(): GridCell {
        const clone = new GridCell(this.x, this.y);
        clone.status = this.status;
        return clone;
    }
}