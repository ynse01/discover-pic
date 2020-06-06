export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height, puzzle) {
        this._status = [];
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._content = [];
        const rows = puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            this._content[y] = Array.from(rows[y]);
            for (let x = 0; x < this.numCols; x++) {
                this.setStatus(x, y, CellStatus.Unknown);
            }
        }
    }
    getXPos(x) {
        return (x * this.cellWidth) + Grid.padding;
    }
    getYPos(y) {
        return (y * this.cellHeight) + Grid.padding;
    }
    getContent(x, y) {
        return this._content[y][x];
    }
    getStatus(x, y) {
        const index = (y * this.numCols) + x;
        return this._status[index];
    }
    setStatus(x, y, value) {
        const index = (y * this.numCols) + x;
        this._status[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
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