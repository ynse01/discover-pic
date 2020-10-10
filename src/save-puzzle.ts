import { Grid } from "./grid.js";
import { GridCell } from "./grid-cell.js";
import { IPuzzle } from "./i-puzzle.js";


export class SavePuzzle implements IPuzzle {
    public name: string;
    public rows: string[];
    public solution?: string;

    constructor(name: string) {
        this.name = name;
        this.rows = [];
    }

    public static fromGrid(grid: Grid, original: IPuzzle): SavePuzzle {
        const saved = new SavePuzzle(grid.name);
        saved.rows = SavePuzzle._getRowsFromGrid(grid);
        saved.solution = original.solution;
        return saved;
    }

    public download(): void {
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(JSON.stringify(this)));
        a.setAttribute('download', this.name + ".json");
        a.click()
    }

    private static _getRowsFromGrid(grid: Grid): string[] {
        const rows: string[] = [];
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
            rows.push(row);
        }
        return rows;
    }
}