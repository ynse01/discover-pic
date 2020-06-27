import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { PuzzleGenerator } from "./puzzle-generator.js";
import { Solver } from "./solver.js";
import { SaveGame } from "./save-game.js";
export class Editor {
    constructor(gridId) {
        this._gridId = gridId;
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
    check() {
        throw new Error("Method not implemented.");
    }
    clear() {
        throw new Error("Method not implemented.");
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
        new GridView(svg, this._grid, this._onCellClick.bind(this));
    }
    _onCellClick(_x, _y) {
        if (this._grid !== undefined) {
            // TODO: Toggle hint
        }
    }
}
//# sourceMappingURL=editor.js.map