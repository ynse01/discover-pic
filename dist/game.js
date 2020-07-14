import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";
import { Solver } from "./solver.js";
import { UndoStack } from "./undo-stack.js";
export class Game {
    constructor(gridId) {
        this._id = gridId;
    }
    load(url) {
        console.log(`Loading puzzle from ${url}`);
        const element = document.getElementById(this._id);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._id}.`);
        }
        const svg = element;
        const width = svg["viewBox"].baseVal.width;
        const height = svg["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        this.loadPuzzle(url, (puzzle) => {
            this._grid = new Grid(width, height, puzzle);
            this.loadSavedGame();
            const view = new GridView(svg, this, this._onCellClick.bind(this));
            view.setGrid(this._grid);
            this._cursor = new Cursor(svg, this);
            this._undo = new UndoStack(this._grid);
            this.restorePoint();
        });
    }
    toggleCursor() {
        let visibility = false;
        const cursor = this._cursor;
        if (cursor !== undefined) {
            cursor.visibility = !cursor.visibility;
            visibility = cursor.visibility;
        }
        return visibility;
    }
    get grid() {
        return this._grid;
    }
    saveGame() {
        if (this._grid !== undefined) {
            const game = SaveGame.fromGrid(this._grid);
            const json = JSON.stringify(game);
            window.localStorage.setItem(this._grid["name"], json);
        }
    }
    restorePoint() {
        var _a;
        (_a = this._undo) === null || _a === void 0 ? void 0 : _a.save();
    }
    undo() {
        var _a;
        (_a = this._undo) === null || _a === void 0 ? void 0 : _a.undo();
    }
    redo() {
        var _a;
        (_a = this._undo) === null || _a === void 0 ? void 0 : _a.redo();
    }
    check() {
        if (this._grid !== undefined) {
            this._grid.checkErrors();
        }
    }
    clear() {
        if (this._grid !== undefined) {
            this._grid.clearGame();
        }
    }
    solve() {
        if (this._grid !== undefined) {
            const solver = new Solver(this._grid);
            solver.solve();
        }
    }
    loadPuzzle(url, cb) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                cb(JSON.parse(request.responseText));
            }
        };
        request.send(null);
    }
    loadSavedGame() {
        if (this._grid !== undefined) {
            const savedString = window.localStorage.getItem(this._grid.name);
            if (savedString !== null) {
                const saveGame = JSON.parse(savedString);
                SaveGame.loadGame(saveGame, this._grid);
                this.checkApplied();
            }
        }
    }
    _onCellClick(cell) {
        if (this._grid !== undefined) {
            this._grid.toggleStatus(cell);
        }
    }
    checkApplied() {
        if (this._grid !== undefined) {
            const iterator = new BlockIterator(this._grid);
            iterator.forEach(block => {
                block.checkApplied();
            });
        }
    }
}
//# sourceMappingURL=game.js.map