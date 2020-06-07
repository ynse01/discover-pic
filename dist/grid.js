export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height, puzzle) {
        this._status = [];
        this._applied = [];
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._hints = [];
        const rows = puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            this._hints[y] = Array.from(rows[y]);
            for (let x = 0; x < this.numCols; x++) {
                this.setStatus(x, y, CellStatus.Unknown);
                this.setApplied(x, y, false);
            }
        }
    }
    getXPos(x) {
        return (x * this.cellWidth) + Grid.padding;
    }
    getYPos(y) {
        return (y * this.cellHeight) + Grid.padding;
    }
    getHint(x, y) {
        return this._hints[y][x];
    }
    getStatus(x, y) {
        let status = CellStatus.Empty;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            status = this._status[index];
        }
        return status;
    }
    setStatus(x, y, value) {
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            this._status[index] = value;
            if (this._cellChangedHandler !== undefined) {
                this._cellChangedHandler(x, y);
            }
        }
    }
    getApplied(x, y) {
        let isApplied = false;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            isApplied = this._applied[index];
        }
        return isApplied;
    }
    setApplied(x, y, applied = true) {
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            this._applied[index] = applied;
            if (this._cellChangedHandler !== undefined) {
                this._cellChangedHandler(x, y);
            }
        }
    }
    inRange(x, y) {
        return x >= 0 && x < this.numCols && y >= 0 && y < this.numRows;
    }
    toggleStatus(x, y) {
        const index = (y * this.numCols) + x;
        const oldStatus = this._status[index];
        let newStatus;
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
        this._status[index] = newStatus;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
        return newStatus;
    }
    registerChangeHandler(handler) {
        this._cellChangedHandler = handler;
    }
}
Grid.padding = 5;
//# sourceMappingURL=grid.js.map