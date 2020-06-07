
export enum CellStatus {
    Unknown = 0,
    Empty,
    Full
}

export class Grid {
    public readonly numCols: number;
    public readonly numRows: number;
    public readonly cellWidth: number;
    public readonly cellHeight: number;
    public static readonly padding = 5;
    private _hints: string[][];
    private _status: CellStatus[] = [];
    private _cellChangedHandler: ((x: number, y: number) => void) | undefined ; 

    constructor(width: number, height: number, puzzle: any) {
        this.numCols = puzzle["numCols"];
        this.numRows = puzzle["numRows"];
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._hints = [];
        const rows = <string[]>puzzle["rows"];
        for (let y = 0; y < this.numRows; y++) {
            this._hints[y] = Array.from(rows[y]);
            for (let x = 0; x < this.numCols; x++) {
                this.setStatus(x, y, CellStatus.Unknown);
            }
        }
    }

    public getXPos(x: number): number {
        return (x * this.cellWidth) + Grid.padding;
    }

    public getYPos(y: number): number {
        return (y * this.cellHeight) + Grid.padding;
    }

    public getHint(x: number, y: number): string {
        return this._hints[y][x];
    }

    public getStatus(x: number, y: number): CellStatus {
        let status = CellStatus.Empty;
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            status = this._status[index];
        }
        return status;
    }

    public setStatus(x: number, y: number, value: CellStatus): void {
        if (this.inRange(x, y)) {
            const index = (y * this.numCols) + x;
            this._status[index] = value;
            if (this._cellChangedHandler !== undefined) {
                this._cellChangedHandler(x, y);
            }
        }
    }

    public inRange(x: number, y: number): boolean {
        return x >= 0 && x < this.numCols && y >= 0 && y < this.numRows;
    }

    public toggleStatus(x: number, y: number): CellStatus {
        const index = (y * this.numCols) + x;
        const oldStatus = this._status[index];
        let newStatus: CellStatus;
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
        this._status[index] = newStatus;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
       return newStatus;
    }

    public registerChangeHandler(handler: (x: number, y: number) => void) {
        this._cellChangedHandler = handler;
    }
}