import { CellStatus } from "./grid.js";
export class GridCell {
    constructor(grid, x, y, hint) {
        this._grid = grid;
        this.x = x;
        this.y = y;
        const hintAsNumber = parseInt(hint);
        if (isNaN(hintAsNumber)) {
            this.hint = -1;
        }
        else {
            this.hint = hintAsNumber;
        }
        this._status = CellStatus.Unknown;
        this._applied = false;
    }
    toggleStatus() {
        let newStatus = CellStatus.Unknown;
        const oldStatus = this._status;
        switch (oldStatus) {
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
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
        if (this._grid.cellChangedHandler !== undefined) {
            this._grid.cellChangedHandler(this);
        }
    }
    get applied() {
        return this._applied;
    }
    set applied(value) {
        this._applied = value;
        if (this._grid.cellChangedHandler !== undefined) {
            this._grid.cellChangedHandler(this);
        }
    }
}
//# sourceMappingURL=grid-cell.js.map