import { CellStatus } from "./grid.js";
import { MicroIterator } from "./micro-iterator.js";
import { NeighborIterator } from "./neighbor-iterator.js";
class BlockStatistics {
    constructor() {
        this.numEmpty = 0;
        this.numFull = 0;
        this.numUnknown = 0;
    }
    add(status) {
        switch (status) {
            case CellStatus.Empty:
                this.numEmpty++;
                break;
            case CellStatus.Full:
                this.numFull++;
                break;
            case CellStatus.Unknown:
                this.numUnknown++;
                break;
        }
    }
    finish() {
        // On the border, less cells ale inspected. Consider cells outside of grid as empty.
        this.numEmpty += 9 - this.numEmpty - this.numFull - this.numUnknown;
    }
    toString() {
        return `${this.numFull} full, ${this.numEmpty} empty and ${this.numUnknown} unknown`;
    }
}
export class Block {
    constructor(grid, cell, hint) {
        this._neighbors = undefined;
        this._grid = grid;
        this.cell = cell;
        this._hint = hint;
        this.applied = false;
        this.error = false;
    }
    get hint() {
        return this._hint;
    }
    applyHint(force = true) {
        if (this.hint >= 0) {
            const stats = this._getStatistics();
            if (stats.numFull + stats.numUnknown === this.hint) {
                this.applied = true;
                this._setUnknownCells(CellStatus.Full);
            }
            else if (stats.numFull === this.hint) {
                this.applied = true;
                this._setUnknownCells(CellStatus.Empty);
            }
            else if (force) {
                const status = (this.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                this.applied = true;
                this._setUnknownCells(status);
            }
        }
    }
    toggleHint() {
        this._hint = -this._hint;
    }
    checkForError() {
        if (this.hint >= 0) {
            const stats = this._getStatistics();
            const tooMany = stats.numFull > this.hint;
            const tooLittle = stats.numEmpty > (9 - this.hint);
            this.error = tooMany || tooLittle;
        }
    }
    checkApplied() {
        let isApplied = true;
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell) => {
            isApplied = isApplied && (this._grid.getStatus(cell) !== CellStatus.Unknown);
        });
        this.applied = isApplied;
        return isApplied;
    }
    get neighbors() {
        if (this._neighbors === undefined) {
            this._neighbors = [];
            const iterator = new NeighborIterator(this._grid, this.cell);
            iterator.forEach(block => {
                this._neighbors.push(block);
            });
        }
        return this._neighbors;
    }
    getNumberUnknownCells() {
        let counter = 0;
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell) => {
            if (this._grid.getStatus(cell) === CellStatus.Unknown) {
                counter++;
            }
        });
        return counter;
    }
    _setUnknownCells(status) {
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell) => {
            if (this._grid.getStatus(cell) === CellStatus.Unknown) {
                this._grid.setStatus(cell, status);
            }
        });
    }
    _getStatistics() {
        const stats = new BlockStatistics();
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell) => {
            const status = this._grid.getStatus(cell);
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
}
//# sourceMappingURL=block.js.map