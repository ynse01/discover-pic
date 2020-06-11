import { CellStatus } from "./grid.js";
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
export class MicroSolver {
    constructor(grid, x, y) {
        this._grid = grid;
        this._x = x;
        this._y = y;
    }
    applyHint() {
        let isApplied = false;
        const cell = this._grid.getCell(this._x, this._y);
        if (cell !== undefined) {
            const hint = cell.hint;
            switch (hint) {
                case 0:
                    this._setAllCells(CellStatus.Empty);
                    isApplied = true;
                    break;
                case 9:
                    this._setAllCells(CellStatus.Full);
                    isApplied = true;
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
                        isApplied = true;
                    }
                    else if (stats.numFull === hint) {
                        this._setUnknownCells(CellStatus.Empty);
                        isApplied = true;
                    }
                    if (!isApplied) {
                        console.log(`Not applied, hint ${hint} with stats ${stats.toString()}.`);
                    }
                    break;
                default:
                    isApplied = false;
                    break;
            }
        }
        return isApplied;
    }
    _setAllCells(status) {
        this._foreach((cell) => {
            cell.status = status;
        });
    }
    _setUnknownCells(status) {
        this._foreach((cell) => {
            if (cell.status === CellStatus.Unknown) {
                cell.status = status;
            }
        });
    }
    _getStatistics() {
        const stats = new MicroStatistics();
        this._foreach((cell) => {
            const status = cell.status;
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
    _foreach(cb) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                const cell = this._grid.getCell(this._x + x, this._y + y);
                if (cell !== undefined) {
                    cb(cell);
                }
            }
        }
    }
}
//# sourceMappingURL=micro-solver.js.map