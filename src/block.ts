import { Grid, CellStatus } from "./grid.js";
import { MicroIterator } from "./micro-iterator.js";

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

export class Block {
    private _grid: Grid;
    public readonly x: number;
    public readonly y: number;
    public readonly hint: number;
    public applied: boolean;
    public error: boolean;

    constructor(grid: Grid, x: number, y: number, hint: number) {
        this._grid = grid;
        this.x = x;
        this.y = y;
        this.hint = hint;
        this.applied = false;
        this.error = false;
    }

    public applyHint(): void {
        this.applied = true;
        const hint = this.hint;
        switch(hint) {
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
                } else if (stats.numFull === hint) {
                    this._setUnknownCells(CellStatus.Empty);
                } else {
                    const status = (this.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                    this._setUnknownCells(status);
                }
                break;
            default:
                break;
        }
    }

    public checkForError(): void {
        const stats = this._getStatistics();
        const tooMany = stats.numFull > this.hint;
        const tooLittle = stats.numEmpty > (9 - this.hint);
        this.error = tooMany || tooLittle;
    }

    public checkApplied(x: number, y: number): boolean {
        let isApplied = true;
        const iterator = new MicroIterator(x, y);
        iterator.forEach((x: number, y: number) => {
            isApplied = isApplied && (this._grid.getStatus(x, y) !== CellStatus.Unknown);
        });
        return isApplied;
    }

    private _setAllCells(status: CellStatus) {
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x: number, y: number) => {
            this._grid.setStatus(x, y, status);
        });
    }

    private _setUnknownCells(status: CellStatus) {
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x: number, y: number) => {
            if (this._grid.getStatus(x, y) === CellStatus.Unknown) {
                this._grid.setStatus(x, y, status);
            }
        });
    }

    private _getStatistics(): MicroStatistics {
        const stats = new MicroStatistics();
        const iterator = new MicroIterator(this.x, this.y);
        iterator.forEach((x: number, y: number) => {
            const status = this._grid.getStatus(x, y);
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
}