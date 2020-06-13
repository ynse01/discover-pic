import { Grid, CellStatus } from "./grid.js";
import { GridCell } from "./grid-cell.js";
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

    public applyHint(): boolean {
        let isApplied = false;
        const hint = this.hint;
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
        return isApplied;
    }

    public checkForError(): void {
        const stats = this._getStatistics();
        const tooMany = stats.numFull > this.hint;
        const tooLittle = stats.numEmpty > (9 - this.hint);
        this.error = tooMany || tooLittle;
    }

    public checkApplied(cell: GridCell): boolean {
        let isApplied = true;
        const iterator = new MicroIterator(this._grid, cell.x, cell.y);
        iterator.forEach(cell => {
            isApplied = isApplied && (cell.status !== CellStatus.Unknown);
        });
        return isApplied;
    }

    private _setAllCells(status: CellStatus) {
        const iterator = new MicroIterator(this._grid, this.x, this.y);
        iterator.forEach((cell: GridCell) => {
            cell.status = status;
            this._grid.setCell(cell);
        });
    }

    private _setUnknownCells(status: CellStatus) {
        const iterator = new MicroIterator(this._grid, this.x, this.y);
        iterator.forEach((cell: GridCell) => {
            if (cell.status === CellStatus.Unknown) {
                cell.status = status;
                this._grid.setCell(cell);
            }
        });
    }

    private _getStatistics(): MicroStatistics {
        const stats = new MicroStatistics();
        const iterator = new MicroIterator(this._grid, this.x, this.y);
        iterator.forEach((cell: GridCell) => {
            const status = cell.status;
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
}