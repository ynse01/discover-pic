import { CellStatus } from "./grid.js";
import { MicroIterator } from "./micro-iterator.js";
class MicroStatistics {
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
        this._grid = grid;
        this.x = x;
        this.y = y;
        this.hint = hint;
        this.applied = false;
        this.error = false;
    }
    applyHint() {
        this.applied = true;
        const hint = this.hint;
        switch (hint) {
            case 0:
                this._setAllCells(CellStatus.Empty);
                break;
            case 9:
                this._setAllCells(CellStatus.Full);
                break;
            case 8:
            case 7:
            case 6:
            case 5:
            case 4:
            case 3:
            case 2:
            case 1:
                const stats = this._getStatistics();
                if (stats.numFull + stats.numUnknown === hint) {
                    this._setUnknownCells(CellStatus.Full);
                }
                else if (stats.numFull === hint) {
                    this._setUnknownCells(CellStatus.Empty);
                }
                else {
                    const status = (this.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                    this._setUnknownCells(status);
                }
                break;
            default:
                break;
        }
    }
    checkForError() {
        const stats = this._getStatistics();
        const tooMany = stats.numFull > this.hint;
        const tooLittle = stats.numEmpty > (9 - this.hint);
        this.error = tooMany || tooLittle;
    }
    checkApplied(x, y) {
        let isApplied = true;
        const iterator = new MicroIterator(x, y);
        iterator.forEach((x, y) => {
            isApplied = isApplied && (this._grid.getStatus(x, y) !== CellStatus.Unknown);
        });
        return isApplied;
    }
    _setAllCells(status) {
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x, y) => {
            this._grid.setStatus(x, y, status);
        });
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
        const stats = new MicroStatistics();
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