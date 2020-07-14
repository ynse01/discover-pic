import { GridIterator } from "./grid-iterator.js";
import { Block } from "./block.js";
import { BlockIterator } from "./block-iterator.js";
import { IPuzzle } from "./game.js";
import { GridCell } from "./grid-cell.js";

export enum CellStatus {
    Unknown = 0,
    Empty,
    Full
}

export class Grid {
    public readonly numCols: number;
    public readonly numRows: number;
    public readonly cellSize: number;
    public static readonly padding = 5;
    private _name: string;
    private _cells: CellStatus[];
    private _blocks: (Block | undefined)[];
    private _cellChangedHandler: ((cell: GridCell) => void) | undefined ; 

    constructor(width: number, height: number, puzzle: IPuzzle) {
        this._name = puzzle.name;
        this._cells = [];
        this._blocks = [];
        this.numCols = 0;
        const rows = puzzle.rows;
        for (let y = 0; y < rows.length; y++) {
            const row = Array.from(rows[y]);
            this.numCols = row.length;
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                const hint = parseInt(row[x]);
                if (!isNaN(hint)) {
                    const cell = new GridCell(x, y);
                    this._blocks.push(new Block(this, cell, hint));
                } else {
                    this._blocks.push(undefined);
                }
                this._cells[baseIndex + x] = CellStatus.Unknown;
            }
        }
        this.numRows = rows.length;
        const cellWidth = (width - 2 * Grid.padding) / (this.numCols + 2);
        const cellHeight = (height - 2 * Grid.padding) / (this.numRows + 2);
        this.cellSize = Math.min(cellWidth, cellHeight);
    }

    public get name(): string {
        return this._name;
    }

    public getXPos(x: number): number {
        return ((x + 1) * this.cellSize) + Grid.padding;
    }

    public getYPos(y: number): number {
        return ((y + 1) * this.cellSize) + Grid.padding;
    }

    public getStatus(cell: GridCell): CellStatus {
        let status: CellStatus = CellStatus.Empty;
        if (this.inRange(cell)) {
            const index = (cell.y * this.numCols) + cell.x;
            status = this._cells[index];
        }
        return status;
    }

    public getBlock(cell: GridCell): Block | undefined {
        let block: Block | undefined = undefined;
        if (this.inRange(cell)) {
            const index = (cell.y * this.numCols) + cell.x;
            block = this._blocks[index];
        }
        return block;
    }

    public setStatus(cell: GridCell, value: CellStatus): void {
        const index = (cell.y * this.numCols) + cell.x;
        this._cells[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(cell);
        }
    }

    public toggleStatus(cell: GridCell): CellStatus {
        let newStatus: CellStatus = CellStatus.Unknown;
        const oldStatus = this.getStatus(cell);
        switch(oldStatus) {
            case CellStatus.Unknown:
                newStatus = CellStatus.Full;
                break;
            case CellStatus.Full:
                newStatus = CellStatus.Empty;
                break;
            case CellStatus.Empty:
                newStatus = CellStatus.Unknown;
                break;
        }
        this.setStatus(cell, newStatus);
        return newStatus;
    }

    public checkErrors(): number {
        let numErrors = 0;
        const iterator = new BlockIterator(this);
        iterator.forEach(block => {
            const oldError = block.error;
            block.checkForError();
            const newError = block.error;
            if (oldError !== newError) {
                // Force cell changed
                this.setStatus(block.cell, this.getStatus(block.cell));
            }
            if (newError) {
                numErrors++;
            }
        });
        console.log(`Found ${numErrors} errors.`);
        return numErrors;
    }

    public inRange(cell: GridCell): boolean {
        return cell.x >= 0 && cell.x < this.numCols && cell.y >= 0 && cell.y < this.numRows;
    }

    public get cellChangedHandler(): ((cell: GridCell) => void) | undefined {
        return this._cellChangedHandler;
    }

    public registerChangeHandler(handler: (cell: GridCell) => void) {
        this._cellChangedHandler = handler;
    }

    public clearGame(): void {
        const blocks = new BlockIterator(this);
        blocks.forEach(block => {
            block.applied = false;
            block.error = false;
        });
        const iterator = new GridIterator(this);
        iterator.forEach((cell) => {
            this.setStatus(cell, CellStatus.Unknown);
        });
    }
}