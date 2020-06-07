import { Grid, CellStatus } from "./grid.js";

class MicroStatistics {
    public numEmpty: number = 0;
    public numFull: number = 0;

    public get numUnknown(): number {
        return 9 - this.numEmpty - this.numFull;
    }

    public add(status: CellStatus): void {
        switch(status) {
            case CellStatus.Empty:
                this.numEmpty++;
                break;
            case CellStatus.Full:
                this.numFull++;
                break;
        }
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
        const hint = this._grid.getHint(this._x, this._y);
        switch(hint) {
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
                } else if (stats.numFull === hintNumber) {
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

    private _setAllCells(status: CellStatus) {
        this._foreach((x: number, y: number) => {
            this._grid.setStatus(this._x + x, this._y + y, status);
        });
    }

    private _setUnknownCells(status: CellStatus) {
        this._foreach((x: number, y: number) => {
            if (this._grid.getStatus(this._x + x, this._y + y) === CellStatus.Unknown) {
                this._grid.setStatus(this._x + x, this._y + y, status);
            }
        });
    }

    private _getStatistics(): MicroStatistics {
        const stats = new MicroStatistics();
        this._foreach((x: number, y: number) => {
            const status = this._grid.getStatus(this._x + x, this._y + y);
            stats.add(status);
        });
        return stats;
    }

    private _foreach(cb: (x: number, y: number) => void): void {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                cb(x, y);
            }
        }        
    }
}