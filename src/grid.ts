
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

    constructor(width: number, height: number) {
        this.numCols = 20;
        this.numRows = 20;
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._content = [];
        for (let i = 0; i < this.numRows; i++) {
            this._content[i] = Array.from("12345678901234567890");
        }
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
    }
}