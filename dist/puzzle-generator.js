import { SaveGame } from "./save-game.js";
import { CellStatus } from "./grid.js";
import { GridCell } from "./grid-cell.js";
import { MicroIterator } from "./micro-iterator.js";
export class PuzzleGenerator {
    static generateSaveGame(columns, rows) {
        const content = PuzzleGenerator._emptyBorder(columns, rows);
        PuzzleGenerator._randomContent(content);
        return SaveGame.fromGenerated("New puzzle", content);
    }
    static saveGame2Puzzle(saveGame) {
        const puzzle = { name: saveGame.name, rows: [] };
        const columns = saveGame.numCols;
        const rows = saveGame.numRows;
        for (let y = 0; y < rows; y++) {
            let row = "";
            for (let x = 0; x < columns; x++) {
                const cell = new GridCell(x, y);
                row += PuzzleGenerator._countFilled(saveGame, cell).toString();
            }
            puzzle.rows[y] = row;
        }
        return puzzle;
    }
    static getRandomNumbers(count) {
        let randoms = new Uint8Array(count);
        randoms = window.crypto.getRandomValues(randoms);
        return randoms;
    }
    static _randomContent(content) {
        const columns = content[0].length - 2;
        const rows = content.length - 2;
        const randoms = this.getRandomNumbers(columns * rows);
        let i = 0;
        for (let y = 1; y <= rows; y++) {
            for (let x = 1; x <= columns; x++) {
                content[y][x] = (randoms[i] > 127);
                i++;
            }
        }
    }
    static _emptyBorder(columns, rows) {
        const content = [];
        for (let y = 0; y < rows + 2; y++) {
            content[y] = Array(columns + 2).fill(false);
        }
        return content;
    }
    static _countFilled(saveGame, cell) {
        const indices = [];
        const iterator = new MicroIterator(cell);
        iterator.forEach(cell => {
            if (SaveGame.getStatus(saveGame, cell) === CellStatus.Full) {
                indices.push(cell.getFlatIndex(saveGame.numCols));
            }
        });
        let count = 0;
        indices.forEach(i => {
            if (saveGame.cells[i] === CellStatus.Full) {
                count++;
            }
        });
        return count;
    }
}
//# sourceMappingURL=puzzle-generator.js.map