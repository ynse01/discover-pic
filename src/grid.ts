
export enum CellStatus {
    Unknown,
    Empty,
    Full
}

export class Grid {
    public readonly numCols: number;
    public readonly numRows: number;
    public readonly cellWidth: number;
    public readonly cellHeight: number;
    public static readonly padding = 5;
    
    constructor(width: number, height: number) {
        this.numCols = 20;
        this.numRows = 20;
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
    }
}