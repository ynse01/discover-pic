import { CellStatus } from "./grid.js";
import { GridIterator } from "./grid-iterator.js";
export class SaveGame {
    constructor() {
        this.name = undefined;
        this.cells = [];
        this.numCols = 0;
        this.numRows = 0;
    }
    static fromGrid(grid) {
        const game = new SaveGame();
        game.name = grid.name;
        game.numCols = grid.numCols;
        game.numRows = grid.numRows;
        const iterator = new GridIterator(grid);
        iterator.forEach((x, y) => {
            game.cells.push(grid.getStatus(x, y));
        });
        return game;
    }
    static fromGenerated(name, content) {
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
    static loadGame(game, grid) {
        let fits = false;
        if (game !== null && game.name === grid.name) {
            const numGridCells = grid.numCols * grid.numRows;
            const numGameCells = game.cells.length;
            if (numGridCells === numGameCells) {
                let i = 0;
                for (let y = 0; y < grid.numRows; y++) {
                    for (let x = 0; x < grid.numCols; x++) {
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
//# sourceMappingURL=save-game.js.map