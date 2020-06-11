import { CellStatus } from "./grid.js";
class SaveGameCell {
    constructor() {
        this.status = CellStatus.Unknown;
        this.applied = false;
    }
    static fromCell(cell) {
        const game = new SaveGameCell();
        game.applied = cell.applied;
        game.status = cell.status;
        return game;
    }
}
export class SaveGame {
    constructor() {
        this.name = undefined;
        this.cells = [];
    }
    static fromGrid(grid) {
        const game = new SaveGame();
        game.name = grid.name;
        grid.foreach(cell => {
            game.cells.push(SaveGameCell.fromCell(cell));
        });
        // Keep compiler happy
        game.name;
        return game;
    }
    static loadGame(game, grid) {
        let fits = false;
        if (game.name === grid.name) {
            const numGridCells = grid.numCols * grid.numRows;
            const numGameCells = game.cells.length;
            if (numGridCells === numGameCells) {
                let i = 0;
                for (let y = 0; y < grid.numRows; y++) {
                    for (let x = 0; x < grid.numCols; x++) {
                        const gridCell = grid.getCell(x, y);
                        const gameCell = game.cells[i];
                        if (gridCell !== undefined) {
                            gridCell.applied = gameCell.applied;
                            gridCell.status = gameCell.status;
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
//# sourceMappingURL=save-game.js.map