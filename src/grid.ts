import { GridIterator } from "./grid-iterator.js";
import { Block } from "./block.js";
import { BlockIterator } from "./block-iterator.js";

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
    private _cellChangedHandler: ((x: number, y: number) => void) | undefined ; 

    constructor(width: number, height: number, puzzle: any) {
        this._name = puzzle["name"];
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        const cellWidth = (width - 2 * Grid.padding) / (this.numCols + 2);
        const cellHeight = (height - 2 * Grid.padding) / (this.numRows + 2);
        this.cellSize = Math.min(cellWidth, cellHeight);
        this._cells = [];
        this._blocks = [];
        const rows = <string[]>puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            const row = Array.from(rows[y]);
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                const hint = parseInt(row[x]);
                if (!isNaN(hint)) {
                    this._blocks.push(new Block(this, x, y, hint));
                } else {
                    this._blocks.push(undefined);
                }
                this._cells[baseIndex + x] = CellStatus.Unknown;
            }
        }
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

    public getStatus(x: number, y: number): CellStatus {
        let status: CellStatus = CellStatus.Empty;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            status = this._cells[index];
        }
        return status;
    }

    public getBlock(x: number, y: number): Block | undefined {
        let block: Block | undefined = undefined;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            block = this._blocks[index];
        }
        return block;
    }

    public setStatus(x: number, y: number, value: CellStatus): void {
        const index = (y * this.numCols) + x;
        this._cells[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
    }

    public toggleStatus(x: number, y: number): CellStatus {
        let newStatus: CellStatus = CellStatus.Unknown;
        const oldStatus = this.getStatus(x, y);
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
        this.setStatus(x, y, newStatus);
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
                this._raiseCellChanged(block.x, block.y);
            }
            if (newError) {
                numErrors++;
            }
        });
        console.log(`Found ${numErrors} errors.`);
        return numErrors;
    }

    public inRange(x: number, y: number): boolean {
        return x >= 0 && x < this.numCols && y >= 0 && y < this.numRows;
    }

    public get cellChangedHandler(): ((x: number, y: number) => void) | undefined {
        return this._cellChangedHandler;
    }

    public registerChangeHandler(handler: (x: number, y: number) => void) {
        this._cellChangedHandler = handler;
    }

    public clearGame(): void {
        const blocks = new BlockIterator(this);
        blocks.forEach(block => {
            block.applied = false;
            block.error = false;
        });
        const iterator = new GridIterator(this);
        iterator.forEach((x, y) => {
            this.setStatus(x, y, CellStatus.Unknown);
            this._raiseCellChanged(x, y);
        });
    }

    private _raiseCellChanged(x: number, y: number): void {
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
    }
}