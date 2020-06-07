import { CellStatus } from "./grid.js";
class MicroStatistics {
    constructor() {
        this.numEmpty = 0;
        this.numFull = 0;
    }
    get numUnknown() {
        return 9 - this.numEmpty - this.numFull;
    }
    add(status) {
        switch (status) {
            case CellStatus.Empty:
                this.numEmpty++;
                break;
            case CellStatus.Full:
                this.numFull++;
                break;
        }
    }
    toString() {
        return `${this.numFull} full, ${this.numEmpty} empty and ${this.numUnknown} unknown`;
    }
}
export class MicroSolver {
    constructor(grid, x, y) {
        this._grid = grid;
        this._x = x;
        this._y = y;
    }
    applyHint() {
        let isApplied = false;
        const hint = this._grid.getHint(this._x, this._y);
        switch (hint) {
            case "0":
                this._setAllCells(CellStatus.Empty);
                isApplied = true;
                break;
            case "9":
                this._setAllCells(CellStatus.Full);
                isApplied = true;
                break;
            case "8":
            case "7":
            case "6":
            case "5":
            case "4":
            case "3":
            case "2":
            case "1":
                const stats = this._getStatistics();
                const hintNumber = parseInt(hint);
                if (stats.numFull + stats.numUnknown === hintNumber) {
                    this._setUnknownCells(CellStatus.Full);
                    isApplied = true;
                }
                else if (stats.numFull === hintNumber) {
                    this._setUnknownCells(CellStatus.Empty);
                    isApplied = true;
                }
                if (!isApplied) {
                    console.log(`Not applied, hint ${hintNumber} with stats ${stats.toString()}.`);
                }
                break;
            default:
                isApplied = false;
                break;
        }
        return isApplied;
    }
    _setAllCells(status) {
        this._foreach((x, y) => {
            this._grid.setStatus(this._x + x, this._y + y, status);
        });
    }
    _setUnknownCells(status) {
        this._foreach((x, y) => {
            if (this._grid.getStatus(this._x + x, this._y + y) === CellStatus.Unknown) {
                this._grid.setStatus(this._x + x, this._y + y, status);
            }
        });
    }
    _getStatistics() {
        const stats = new MicroStatistics();
        this._foreach((x, y) => {
            const status = this._grid.getStatus(this._x + x, this._y + y);
            stats.add(status);
        });
        return stats;
    }
    _foreach(cb) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                cb(x, y);
            }
        }
    }
}
//# sourceMappingURL=micro-solver.js.map