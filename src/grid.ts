
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
    private _content: string[][];
    private _status: CellStatus[] = [];
    private _cellChangedHandler: ((x: number, y: number) => void) | undefined ; 

    constructor(width: number, height: number) {
        this.numCols = 20;
        this.numRows = 20;
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._content = [];
        for (let y = 0; y < this.numRows; y++) {
            this._content[y] = Array.from("12345678901234567890");
            for (let x = 0; x < this.numCols; x++) {
                const dummy = ((y * this.numCols) + x) % 3;
                this.setStatus(x, y, <CellStatus>dummy);
            }
        }
    }

    public getXPos(x: number): number {
        return (x * this.cellWidth) + Grid.padding;
    }

    public getYPos(y: number): number {
        return (y * this.cellHeight) + Grid.padding;
    }

    public getContent(x: number, y: number): string {
        return this._content[y][x];
    }

    public getStatus(x: number, y: number): CellStatus {
        const index = (y * this.numCols) + x;
        return this._status[index];
    }

    public setStatus(x: number, y: number, value: CellStatus): void {
        const index = (y * this.numCols) + x;
        this._status[index] = value;
        if (this._cellChangedHandler !== undefined) {
            this._cellChangedHandler(x, y);
        }
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