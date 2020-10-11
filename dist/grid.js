import { GridIterator } from "./grid-iterator.js";
import { Block } from "./block.js";
import { BlockIterator } from "./block-iterator.js";
import { GridCell } from "./grid-cell.js";
export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height, puzzle) {
        this._puzzle = puzzle;
        this._cells = [];
        this._blocks = [];
        this.numCols = 0;
        const rows = puzzle.rows;
        for (let y = 0; y < rows.length; y++) {
            const row = Array.from(rows[y]);
            this.numCols = row.length;
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                const hint = parseInt(row[x]);
                if (!isNaN(hint)) {
                    const cell = new GridCell(x, y);
                    this._blocks.push(new Block(this, cell, hint));
                }
                else {
                    this._blocks.push(undefined);
                }
                this._cells[baseIndex + x] = CellStatus.Unknown;
            }
        }
        this.numRows = rows.length;
        const cellWidth = (width - 2 * Grid.padding) / (this.numCols + 2);
        const cellHeight = (height - 2 * Grid.padding) / (this.numRows + 2);
        this.cellSize = Math.min(cellWidth, cellHeight);
    }
    get name() {
        return this._puzzle.name;
    }
    getXPos(x) {
        return ((x + 1) * this.cellSize) + Grid.padding;
    }
    getYPos(y) {
        return ((y + 1) * this.cellSize) + Grid.padding;
    }
    getStatus(cell) {
        let status = CellStatus.Empty;
        if (this.inRange(cell)) {
            const index = cell.getFlatIndex(this.numCols);
            status = this._cells[index];
        }
        return status;
    }
    getBlock(cell) {
        let block = undefined;
        if (this.inRange(cell)) {
            const index = cell.getFlatIndex(this.numCols);
            block = this._blocks[index];
        }
        return block;
    }
    setStatus(cell, value) {
        const index = cell.getFlatIndex(this.numCols);
        this._cells[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(cell);
        }
    }
    toggleStatus(cell) {
        let newStatus = CellStatus.Unknown;
        const oldStatus = this.getStatus(cell);
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
        this.setStatus(cell, newStatus);
        return newStatus;
    }
    inRange(cell) {
        return cell.x >= 0 && cell.x < this.numCols && cell.y >= 0 && cell.y < this.numRows;
    }
    get cellChangedHandler() {
        return this._cellChangedHandler;
    }
    registerChangeHandler(handler) {
        this._cellChangedHandler = handler;
    }
    clearGame() {
        const blocks = new BlockIterator(this);
        blocks.forEach(block => {
            block.applied = false;
            block.error = false;
        });
        const iterator = new GridIterator(this);
        iterator.forEach((cell) => {
            this.setStatus(cell, CellStatus.Unknown);
        });
    }
}
Grid.padding = 5;
//# sourceMappingURL=grid.js.map