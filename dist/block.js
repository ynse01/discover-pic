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
    constructor(grid, x, y, hint) {
        this._neighbors = undefined;
        this._grid = grid;
        this.x = x;
        this.y = y;
        this.hint = hint;
        this.applied = false;
        this.error = false;
    }
    applyHint(force = true) {
        const stats = this._getStatistics();
        if (stats.numFull + stats.numUnknown === this.hint) {
            this._setUnknownCells(CellStatus.Full);
            this.applied = true;
        }
        else if (stats.numFull === this.hint) {
            this._setUnknownCells(CellStatus.Empty);
            this.applied = true;
        }
        else if (force) {
            const status = (this.hint > 4) ? CellStatus.Full : CellStatus.Empty;
            this._setUnknownCells(status);
            this.applied = true;
        }
    }
    checkForError() {
        const stats = this._getStatistics();
        const tooMany = stats.numFull > this.hint;
        const tooLittle = stats.numEmpty > (9 - this.hint);
        this.error = tooMany || tooLittle;
    }
    checkApplied() {
        let isApplied = true;
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x, y) => {
            isApplied = isApplied && (this._grid.getStatus(x, y) !== CellStatus.Unknown);
        });
        this.applied = isApplied;
        return isApplied;
    }
    get neighbors() {
        if (this._neighbors === undefined) {
            this._neighbors = [];
            const iterator = new NeighborIterator(this._grid, this.x, this.y);
            iterator.forEach(block => {
                this._neighbors.push(block);
            });
        }
        return this._neighbors;
    }
    getNumberUnknownCells() {
        let counter = 0;
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x, y) => {
            if (this._grid.getStatus(x, y) === CellStatus.Unknown) {
                counter++;
            }
        });
        return counter;
    }
    _setUnknownCells(status) {
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x, y) => {
            if (this._grid.getStatus(x, y) === CellStatus.Unknown) {
                this._grid.setStatus(x, y, status);
            }
        });
    }
    _getStatistics() {
        const stats = new BlockStatistics();
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x, y) => {
            const status = this._grid.getStatus(x, y);
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
}
//# sourceMappingURL=block.js.map