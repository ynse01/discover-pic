import { CellStatus, Grid } from "./grid.js";

export class GridCell {
    public readonly x: number;
    public readonly y: number;
    public readonly hint: number;
    private _status: CellStatus;
    private _applied: boolean;
    private _grid: Grid;

    constructor(grid: Grid, x: number, y: number, hint: string) {
        this._grid = grid;
        this.x = x;
        this.y = y;
        const hintAsNumber = parseInt(hint);
        if (isNaN(hintAsNumber)) {
            this.hint = -1;
        } else {
            this.hint = hintAsNumber;
        }
        this._status = CellStatus.Unknown;
        this._applied = false;
    }

    public toggleStatus(): CellStatus {
        let newStatus: CellStatus = CellStatus.Unknown;
        const oldStatus = this._status;
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

    public get status(): CellStatus {
        return this._status;
    }

    public set status(value: CellStatus) {
        this._status = value;
        if (this._grid.cellChangedHandler !== undefined) {
            this._grid.cellChangedHandler(this);
        }
    }

    public get applied(): boolean {
        return this._applied;
    }

    public set applied(value: boolean) {
        this._applied = value;
        if (this._grid.cellChangedHandler !== undefined) {
            this._grid.cellChangedHandler(this);
        }
    }
}