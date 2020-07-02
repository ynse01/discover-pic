import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { PuzzleGenerator } from "./puzzle-generator.js";
import { Solver } from "./solver.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";
export class Editor {
    constructor(gridId) {
        this._gridId = gridId;
    }
    get grid() {
        return this._grid;
    }
    load(_url) {
        this.generate(45, 35);
    }
    toggleCursor() {
        throw new Error("Method not implemented.");
    }
    saveGame() {
        throw new Error("Method not implemented.");
    }
    undo() {
        throw new Error("Method not implemented.");
    }
    restorePoint() {
        throw new Error("Method not implemented.");
    }
    redo() {
        throw new Error("Method not implemented.");
    }
    check() {
        throw new Error("Method not implemented.");
    }
    clear() {
        if (this._grid !== undefined) {
            var iterator = new BlockIterator(this._grid);
            iterator.forEach(block => {
                if (block.hint < 0) {
                    this._onCellClick(block.x, block.y);
                }
            });
        }
    }
    solve() {
        if (this._grid !== undefined) {
            const solver = new Solver(this._grid);
            solver.solve();
        }
    }
    generate(columns, rows) {
        const element = document.getElementById(this._gridId);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._gridId}.`);
        }
        const svg = element;
        const width = svg["viewBox"].baseVal.width;
        const height = svg["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        const saveGame = PuzzleGenerator.generateSaveGame(columns, rows);
        const puzzle = PuzzleGenerator.saveGame2Puzzle(saveGame);
        this._grid = new Grid(width, height, puzzle);
        SaveGame.loadGame(saveGame, this._grid);
        new GridView(svg, this, this._onCellClick.bind(this));
    }
    _onCellClick(x, y) {
        if (this._grid !== undefined) {
            var block = this._grid.getBlock(x, y);
            if (block !== undefined) {
                block.toggleHint();
                // Force change handler to run.
                this._grid.setStatus(x, y, this._grid.getStatus(x, y));
            }
        }
    }
}
//# sourceMappingURL=editor.js.map