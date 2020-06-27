import { GridIterator } from "./grid-iterator.js";
import { Block } from "./block.js";
import { BlockIterator } from "./block-iterator.js";
export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height, puzzle) {
        this._name = puzzle.name;
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
                    this._blocks.push(new Block(this, x, y, hint));
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
        return this._name;
    }
    getXPos(x) {
        return ((x + 1) * this.cellSize) + Grid.padding;
    }
    getYPos(y) {
        return ((y + 1) * this.cellSize) + Grid.padding;
    }
    getStatus(x, y) {
        let status = CellStatus.Empty;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            status = this._cells[index];
        }
        return status;
    }
    getBlock(x, y) {
        let block = undefined;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            block = this._blocks[index];
        }
        return block;
    }
    setStatus(x, y, value) {
        const index = (y * this.numCols) + x;
        this._cells[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
    }
    toggleStatus(x, y) {
        let newStatus = CellStatus.Unknown;
        const oldStatus = this.getStatus(x, y);
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
        this.setStatus(x, y, newStatus);
        return newStatus;
    }
    checkErrors() {
        let numErrors = 0;
        const iterator = new BlockIterator(this);
        iterator.forEach(block => {
            const oldError = block.error;
            block.checkForError();
            const newError = block.error;
            if (oldError !== newError) {
                // Force cell changed
                this.setStatus(block.x, block.y, this.getStatus(block.x, block.y));
            }
            if (newError) {
                numErrors++;
            }
        });
        console.log(`Found ${numErrors} errors.`);
        return numErrors;
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
        const blocks = new BlockIterator(this);
        blocks.forEach(block => {
            block.applied = false;
            block.error = false;
        });
        const iterator = new GridIterator(this);
        iterator.forEach((x, y) => {
            this.setStatus(x, y, CellStatus.Unknown);
        });
    }
}
Grid.padding = 5;
//# sourceMappingURL=grid.js.map