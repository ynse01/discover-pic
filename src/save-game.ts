import { Grid, CellStatus } from "./grid.js";
import { GridCell } from "./grid-cell.js";
import { GridIterator } from "./grid-iterator.js";

class SaveGameCell {
    public status: CellStatus = CellStatus.Unknown;
    public applied: boolean = false;

    public static fromCell(cell: GridCell): SaveGameCell {
        const game = new SaveGameCell();
        game.status = cell.status;
        return game;
    }
}

export class SaveGame {
    private name: string | undefined = undefined;
    private cells: SaveGameCell[] = [];

    public static fromGrid(grid: Grid): SaveGame {
        const game = new SaveGame();
        game.name = grid.name;
        const iterator = new GridIterator(grid);
        iterator.forEach(cell => {
            game.cells.push(SaveGameCell.fromCell(cell));
        });
        // Keep compiler happy
        game.name;
        return game;
    }

    public static loadGame(game: SaveGame, grid: Grid): boolean {
        let fits = false;
        if (game !== null && game.name === grid.name) {
            const numGridCells = grid.numCols * grid.numRows;
            const numGameCells = game.cells.length;
            if (numGridCells === numGameCells) {
                let i = 0;
                for (let y = 0; y < grid.numRows; y++) {
                    for(let x = 0; x < grid.numCols; x++) {
                        const gridCell = grid.getCell(x, y);
                        const gameCell = game.cells[i];
                        if (gridCell !== undefined) {
                            gridCell.status = gameCell.status;
                            grid.setCell(gridCell);
                        }
                        i++;
                    }
                }                                
                fits = true;
            }
        }
        return fits;
    }
}