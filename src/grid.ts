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
    private _cells: GridCell[];
    private _cellChangedHandler: ((cell: GridCell) => void) | undefined ; 

    constructor(width: number, height: number, puzzle: any) {
        this._name = puzzle["name"];
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        const cellWidth = (width - 2 * Grid.padding) / (this.numCols + 2);
        const cellHeight = (height - 2 * Grid.padding) / (this.numRows + 2);
        this.cellSize = Math.min(cellWidth, cellHeight);
        this._cells = [];
        const rows = <string[]>puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            const row = Array.from(rows[y]);
            const baseIndex = y * this.numCols;
            for (let x = 0; x < this.numCols; x++) {
                const hint = parseInt(row[x]);
                this._cells[baseIndex + x] = new GridCell(this, x, y, hint);
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

    public getCell(x: number, y: number): GridCell | undefined {
        let cell: GridCell | undefined = undefined;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            cell = this._cells[index].clone();
        }
        return cell;
    }

    public setCell(cell: GridCell): void {
        const index = (cell.y * this.numCols) + cell.x;
        this._cells[index] = cell;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(cell);
        }
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

    public clearGame(): void {
        this.foreach(cell => {
            cell.applied = false;
            cell.status = CellStatus.Unknown;
            this.setCell(cell);
        });
    }

    public foreach(cb: (cell: GridCell) => void): void {
        for (let y = 0; y < this.numRows; y++) {
            for(let x = 0; x < this.numCols; x++) {
                const cell = this.getCell(x, y);
                if (cell !== undefined) {
                    cb(cell);
                }
            }
        }        
    }
}