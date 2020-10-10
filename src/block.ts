import { Grid, CellStatus } from "./grid.js";
import { MicroIterator } from "./micro-iterator.js";
import { NeighborIterator } from "./neighbor-iterator.js";
import { GridCell } from "./grid-cell.js";

class BlockStatistics {
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
    public readonly cell: GridCell;
    public applied: boolean;
    public error: boolean;
    private _hint: number;
    private _neighbors: Block[] | undefined = undefined;

    constructor(grid: Grid, cell: GridCell, hint: number) {
        this._grid = grid;
        this.cell = cell;
        this._hint = hint;
        this.applied = false;
        this.error = false;
    }

    public get hint(): number {
        return this._hint;
    }

    public applyHint(force: boolean = true): void {
        if (this.hint >= 0) {
            const stats = this._getStatistics();
            if (stats.numFull + stats.numUnknown === this.hint) {
                this.applied = true;
                this._setUnknownCells(CellStatus.Full);
            } else if (stats.numFull === this.hint) {
                this.applied = true;
                this._setUnknownCells(CellStatus.Empty);
            } else if (force) {
                const status = (this.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                this.applied = true;
                this._setUnknownCells(status);
            }
        }
    }

    public toggleHint(): void {
        this._hint = -this._hint;
    }

    public clear(): void {
        this.applied = false;
        this.error = false;
        this._hint = -1;
    }

    public checkForError(): void {
        if (this.hint >= 0) {
            const stats = this._getStatistics();
            const tooMany = stats.numFull > this.hint;
            const tooLittle = stats.numEmpty > (9 - this.hint);
            this.error = tooMany || tooLittle;
        }
    }

    public checkApplied(): boolean {
        let isApplied = true;
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell: GridCell) => {
            isApplied = isApplied && (this._grid.getStatus(cell) !== CellStatus.Unknown);
        });
        this.applied = isApplied;
        return isApplied;
    }

    public get neighbors(): Block[] {
        if (this._neighbors === undefined) {
            this._neighbors = [];
            const iterator = new NeighborIterator(this._grid, this.cell);
            iterator.forEach(block => {
                this._neighbors!.push(block);
            });
        }
        return this._neighbors;
    }

    public getNumberUnknownCells(): number {
        let counter = 0;
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell: GridCell) => {
            if (this._grid.getStatus(cell) === CellStatus.Unknown) {
                counter++;
            }
        });
        return counter;
    }

    private _setUnknownCells(status: CellStatus) {
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell: GridCell) => {
            if (this._grid.getStatus(cell) === CellStatus.Unknown) {
                this._grid.setStatus(cell, status);
            }
        });
    }

    private _getStatistics(): BlockStatistics {
        const stats = new BlockStatistics();
        const iterator = new MicroIterator(this.cell);
        iterator.forEach((cell: GridCell) => {
            const status = this._grid.getStatus(cell);
            stats.add(status);
        });
        stats.finish();
        return stats;
    }
}