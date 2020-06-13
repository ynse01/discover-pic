import { GridIterator } from "./grid-iterator.js";
export class SaveGame {
    constructor() {
        this.name = undefined;
        this.cells = [];
    }
    static fromGrid(grid) {
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