export var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["Unknown"] = 0] = "Unknown";
    CellStatus[CellStatus["Empty"] = 1] = "Empty";
    CellStatus[CellStatus["Full"] = 2] = "Full";
})(CellStatus || (CellStatus = {}));
export class Grid {
    constructor(width, height) {
        this._status = [];
        this.numCols = 20;
        this.numRows = 20;
        this.cellWidth = (width - 2 * Grid.padding) / this.numCols;
        this.cellHeight = (height - 2 * Grid.padding) / this.numRows;
        this._content = [];
        for (let y = 0; y < this.numRows; y++) {
            this._content[y] = Array.from("12345678901234567890");
            for (let x = 0; x < this.numCols; x++) {
                const dummy = ((y * this.numCols) + x) % 3;
                this.setStatus(x, y, dummy);
            }
        }
    }
    getXPos(x) {
        return (x * this.cellWidth) + Grid.padding;
    }
    getYPos(y) {
        return (y * this.cellHeight) + Grid.padding;
    }
    getContent(x, y) {
        return this._content[y][x];
    }
    getStatus(x, y) {
        const index = (y * this.numCols) + x;
        return this._status[index];
    }
    setStatus(x, y, value) {
        const index = (y * this.numCols) + x;
        this._status[index] = value;
    }
}
Grid.padding = 5;
//# sourceMappingURL=grid.js.map