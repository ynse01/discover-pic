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
    private _cells: GridCell[];
    private _cellChangedHandler: ((cell: GridCell) => void) | undefined ; 

    constructor(width: number, height: number, puzzle: any) {
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        const cellWidth = (width - 2 * Grid.padding) / this.numCols;
        const cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this.cellSize = Math.min(cellWidth, cellHeight);
        this._cells = [];
        const rows = <string[]>puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            const row = Array.from(rows[y]);
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                this._cells[baseIndex + x] = new GridCell(this, x, y, row[x]);
            }
        }
    }

    public getXPos(x: number): number {
        return (x * this.cellSize) + Grid.padding;
    }

    public getYPos(y: number): number {
        return (y * this.cellSize) + Grid.padding;
    }

    public getCell(x: number, y: number): GridCell | undefined {
        let cell: GridCell | undefined = undefined;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            cell = this._cells[index];
        }
        return cell;
    }

    public inRange(x: number, y: number): boolean {
        return x >= 0 && x < this.numCols && y >= 0 && y < this.numRows;
    }

    public get cellChangedHandler(): ((cell: GridCell) => void) | undefined {
        return this._cellChangedHandler;
    }

    public registerChangeHandler(handler: (cell: GridCell) => void) {
        this._cellChangedHandler = handler;
    }
}