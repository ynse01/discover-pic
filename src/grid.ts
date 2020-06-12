import { GridCell } from "./grid-cell.js";
import { MicroIterator } from "./micro-iterator.js";
import { GridIterator } from "./grid-iterator.js";
import { MicroSolver } from "./micro-solver.js";

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
                this._cells[baseIndex + x] = new GridCell(x, y, hint);
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

    public checkApplied(cell: GridCell): void {
        cell.applied = this._isApplied(cell);
        this.setCell(cell);
    }

    public checkErrors(): number {
        let numErrors = 0;
        const iterator = new GridIterator(this);
        iterator.foreach(cell => {
            if (cell.hint >= 0) {
                const solver = new MicroSolver(this, cell.x, cell.y);
                const ok = solver.checkHint();
                cell.error = !ok;
                if (!ok) {
                    numErrors++;
                }
                this.setCell(cell);
            }
        });
        console.log(`Found ${numErrors} errors.`);
        return numErrors;
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
        const iterator = new GridIterator(this);
        iterator.foreach(cell => {
            cell.applied = false;
            cell.status = CellStatus.Unknown;
            this.setCell(cell);
        });
    }

    private _isApplied(cell: GridCell): boolean {
        let isApplied = true;
        const iterator = new MicroIterator(this, cell.x, cell.y);
        iterator.foreach(cell => {
            isApplied = isApplied && (cell.status !== CellStatus.Unknown);
        });
        return isApplied;
    }
}