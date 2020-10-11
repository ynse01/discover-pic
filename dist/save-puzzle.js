import { GridCell } from "./grid-cell.js";
export class SavePuzzle {
    constructor(name) {
        this.name = name;
        this.rows = [];
    }
    static fromGrid(grid, original) {
        const saved = new SavePuzzle(grid.name);
        saved.rows = SavePuzzle._getRowsFromGrid(grid);
        saved.solution = original.solution;
        return saved;
    }
    download() {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this)));
        a.setAttribute('download', this.name + ".json");
        a.click();
    }
    static _getRowsFromGrid(grid) {
        const rows = [];
        for (var y = 0; y < grid.numRows; y++) {
            let row = "";
            for (var x = 0; x < grid.numCols; x++) {
                const cell = new GridCell(x, y);
                var block = grid.getBlock(cell);
                if (block !== undefined && block.hint >= 0) {
                    row += block.hint.toString();
                }
                else {
                    row += " ";
                }
            }
            rows.push(row);
        }
        return rows;
    }
}
//# sourceMappingURL=save-puzzle.js.map