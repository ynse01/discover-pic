import { Grid } from "./grid.js";
import { GridCell } from "./grid-cell.js";


export class SaveHint {
    public name: string;
    public rows: string[];

    constructor(name: string) {
        this.name = name;
        this.rows = [];
    }

    public static fromGrid(grid: Grid): SaveHint {
        const saved = new SaveHint(grid.name);
        for(var y = 0; y < grid.numRows; y++) {
            let row = "";
            for(var x = 0; x < grid.numCols; x++) {
                const cell = new GridCell(x, y);
                var block = grid.getBlock(cell);
                if (block !== undefined && block.hint >= 0) {
                    row += block.hint.toString();
                } else {
                    row += " ";
                }
            }
            saved.rows.push(row);
        }
        return saved;
    }

    public download(): void {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(JSON.stringify(this)));
        a.setAttribute('download', this.name + ".json");
        a.click()
    }
}