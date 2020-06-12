import { Grid, CellStatus } from "./grid.js";
import { GridCell } from "./grid-cell.js";

class MicroStatistics {
    public numEmpty: number = 0;
    public numFull: number = 0;
    public numUnknown: number = 0;

    public add(status: CellStatus): void {
        switch(status) {
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

    public finish(): void {
        // On the border, less cells ale inspected. Consider cells outside of grid as empty.
        this.numEmpty += 9 - this.numEmpty - this.numFull - this.numUnknown;
    }

    public toString(): string {
        return `${this.numFull} full, ${this.numEmpty} empty and ${this.numUnknown} unknown`;
    }
}

export class MicroSolver {
    private _grid: Grid;
    private _x: number;
    private _y: number;

    constructor(grid: Grid, x: number, y: number) {
        this._grid = grid;
        this._x = x;
        this._y = y;
    }

    public applyHint(): boolean {
        let isApplied = false;
        const cell = this._grid.getCell(this._x, this._y);
        if (cell !== undefined) {
            const hint = cell.hint;
            switch(hint) {
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
                    } else if (stats.numFull === hint) {
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

    private _setAllCells(status: CellStatus) {
        this._foreach((cell: GridCell) => {
            cell.status = status;
            this._grid.setCell(cell);
        });
    }

    private _setUnknownCells(status: CellStatus) {
        this._foreach((cell: GridCell) => {
            if (cell.status === CellStatus.Unknown) {
                cell.status = status;
                this._grid.setCell(cell);
            }
        });
    }

    private _getStatistics(): MicroStatistics {
        const stats = new MicroStatistics();
        this._foreach((cell: GridCell) => {
            const status = cell.status;
            stats.add(status);
        });
        stats.finish();
        return stats;
    }

    private _foreach(cb: (cell: GridCell) => void): void {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                const cell = this._grid.getCell(this._x + x, this._y + y);
                if (cell !== undefined) {
                    cb(cell);
                }
            }
        }        
    }
}