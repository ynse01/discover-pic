import { CellStatus, Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";
import { UndoStack } from "./undo-stack.js";
import { GameClicker } from "./game-clicker.js";
import { PuzzleSolution } from "./puzzle-solution.js";
import { MicroIterator } from "./micro-iterator.js";
import { GridIterator } from "./grid-iterator.js";
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
            const view = new GridView(svg, new GameClicker(this));
            view.setGrid(this._grid);
            this._cursor = new Cursor(svg, this, this._onCursor.bind(this));
            this._undo = new UndoStack(this._grid);
            this._solution = new PuzzleSolution(puzzle);
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
            var iterator = new BlockIterator(this._grid);
            if (this._solution !== undefined) {
                iterator.forEach(block => {
                    if (block.hint >= 0) {
                        var blockIterator = new MicroIterator(block.cell);
                        var hasError = false;
                        blockIterator.forEach(cell => {
                            if (this._grid.inRange(cell)) {
                                var gridStatus = this._grid.getStatus(cell);
                                var solutionStatus = this._solution.getStatus(cell);
                                hasError = hasError || !this.areAllowedStatuses(gridStatus, solutionStatus);
                            }
                        });
                        if (hasError) {
                            block.error = true;
                            // Refresh the state
                            this._grid.setStatus(block.cell, this._grid.getStatus(block.cell));
                        }
                    }
                });
            }
        }
    }
    clear() {
        if (this._grid !== undefined) {
            this._grid.clearGame();
        }
    }
    solve() {
        if (this._grid !== undefined && this._solution !== undefined) {
            // Override current status with the solution.
            var gridIterator = new GridIterator(this._grid);
            gridIterator.forEach(cell => {
                var solutionStatus = this._solution.getStatus(cell);
                this._grid.setStatus(cell, solutionStatus);
            });
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
    _onCursor(cell) {
        if (this._grid !== undefined) {
            const block = this._grid.getBlock(cell);
            if (block !== undefined) {
                block.applyHint();
                // Force change handler to run.
                this._grid.setStatus(cell, this._grid.getStatus(cell));
                this.restorePoint();
            }
        }
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
    checkApplied() {
        if (this._grid !== undefined) {
            const iterator = new BlockIterator(this._grid);
            iterator.forEach(block => {
                block.checkApplied();
            });
        }
    }
    // Compare the current grid status, with the solution's status.
    areAllowedStatuses(gridStatus, solutionStatus) {
        let result = false;
        if (gridStatus === CellStatus.Unknown) {
            result = true;
        }
        else if (gridStatus === solutionStatus) {
            result = true;
        }
        return result;
    }
}
//# sourceMappingURL=game.js.map