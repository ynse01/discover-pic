import { GridCell } from "./grid-cell.js";
export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height, puzzle) {
        this._name = puzzle["name"];
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        const cellWidth = (width - 2 * Grid.padding) / (this.numCols + 2);
        const cellHeight = (height - 2 * Grid.padding) / (this.numRows + 2);
        this.cellSize = Math.min(cellWidth, cellHeight);
        this._cells = [];
        const rows = puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            const row = Array.from(rows[y]);
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                this._cells[baseIndex + x] = new GridCell(this, x, y, row[x]);
            }
        }
    }
    get name() {
        return this._name;
    }
    getXPos(x) {
        return ((x + 1) * this.cellSize) + Grid.padding;
    }
    getYPos(y) {
        return ((y + 1) * this.cellSize) + Grid.padding;
    }
    getCell(x, y) {
        let cell = undefined;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            cell = this._cells[index];
        }
        return cell;
    }
    inRange(x, y) {
        return x >= 0 && x < this.numCols && y >= 0 && y < this.numRows;
    }
    get cellChangedHandler() {
        return this._cellChangedHandler;
    }
    registerChangeHandler(handler) {
        this._cellChangedHandler = handler;
    }
    clearGame() {
        this.foreach(cell => {
            cell.applied = false;
            cell.status = CellStatus.Unknown;
        });
    }
    foreach(cb) {
        for (let y = 0; y < this.numRows; y++) {
            for (let x = 0; x < this.numCols; x++) {
                const cell = this.getCell(x, y);
                if (cell !== undefined) {
                    cb(cell);
                }
            }
        }
    }
}
Grid.padding = 5;
//# sourceMappingURL=grid.js.map