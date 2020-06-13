import { Grid, CellStatus } from "./grid.js";
import { GridIterator } from "./grid-iterator.js";

export class SaveGame {
    private name: string | undefined = undefined;
    private cells: CellStatus[] = [];

    public static fromGrid(grid: Grid): SaveGame {
        const game = new SaveGame();
        game.name = grid.name;
        const iterator = new GridIterator(grid);
        iterator.forEach((x, y) => {
            game.cells.push(grid.getStatus(x, y));
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
                        const gameCell = game.cells[i];
                        grid.setStatus(x, y, gameCell);
                        i++;
                    }
                }                                
                fits = true;
            }
        }
        return fits;
    }
}