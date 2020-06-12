import { CellStatus, Grid } from "./grid.js";

export class GridCell {
    public readonly x: number;
    public readonly y: number;
    public readonly hint: number;
    public status: CellStatus;
    public applied: boolean;
    private _grid: Grid;

    constructor(grid: Grid, x: number, y: number, hint: number) {
        this._grid = grid;
        this.x = x;
        this.y = y;
        if (isNaN(hint)) {
            this.hint = -1;
        } else {
            this.hint = hint;
        }
        this.status = CellStatus.Unknown;
        this.applied = false;
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
        const clone = new GridCell(this._grid, this.x, this.y, this.hint);
        clone.applied = this.applied;
        clone.status = this.status;
        return clone;
    }
}