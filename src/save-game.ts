import { Grid, CellStatus } from "./grid.js";
import { GridIterator } from "./grid-iterator.js";
import { GridCell } from "./grid-cell.js";

export class SaveGame {
    public name: string | undefined = undefined;
    public cells: CellStatus[] = [];
    public numCols: number = 0;
    public numRows: number = 0;

    public static fromGrid(grid: Grid): SaveGame {
        const game = new SaveGame();
        game.name = grid.name;
        game.numCols = grid.numCols;
        game.numRows = grid.numRows;
        const iterator = new GridIterator(grid);
        iterator.forEach((cell) => {
            game.cells.push(grid.getStatus(cell));
        });
        return game;
    }

    public static fromGenerated(name: string, content: boolean[][]): SaveGame {
        const game = new SaveGame();
        game.numRows = content.length - 2;
        game.numCols = content[0].length - 2;
        game.name = name;
        for (let y = 1; y <= game.numRows; y++) {
            for (let x = 1; x <= game.numCols; x++) {
                const status = (content[y][x]) ? CellStatus.Full : CellStatus.Empty;
                game.cells.push(status);
            }
        }
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
                        const gameCell = new GridCell(x, y);
                        const gameCellStatus = game.cells[i];
                        grid.setStatus(gameCell, gameCellStatus);
                        i++;
                    }
                }                                
                fits = true;
            }
        }
        return fits;
    }

    public static getStatus(saveGame: SaveGame, cell: GridCell): CellStatus {
        if (cell.x >= 0 && cell.x < saveGame.numCols) {
            if (cell.y >= 0 && cell.y < saveGame.numRows) {
                const index = cell.getFlatIndex(saveGame.numCols);
                return saveGame.cells[index];
            }
        }
        return CellStatus.Empty;
    }
}