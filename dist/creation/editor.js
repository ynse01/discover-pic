import { CellStatus, Grid } from "../grid.js";
import { GridView } from "../grid-view.js";
import { PuzzleGenerator } from "./puzzle-generator.js";
import { SaveGame } from "../save-game.js";
import { BlockIterator } from "../block-iterator.js";
import { SavePuzzle } from "../save-puzzle.js";
import { GridIterator } from "../grid-iterator.js";
import { MicroIterator } from "../micro-iterator.js";
import { GridCell } from "../grid-cell.js";
import { EditorClicker } from "./editor-clicker.js";
import { Cursor } from "../cursor.js";
import { PuzzleSolution } from "../puzzle-solution.js";
export class Editor {
    constructor(gridId) {
        this._gridId = gridId;
        const element = document.getElementById(this._gridId);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._gridId}.`);
        }
        const svg = element;
        this._width = svg["viewBox"].baseVal.width;
        this._height = svg["viewBox"].baseVal.height;
        if (this._width == null || this._height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        this._view = new GridView(svg, new EditorClicker(this));
    }
    get grid() {
        return this._grid;
    }
    load(_url) {
        // Silently ignore
    }
    toggleCursor() {
        // Silently ignore
        return false;
    }
    saveGame() {
        if (this._grid !== undefined && this._puzzle !== undefined) {
            var saved = SavePuzzle.fromGrid(this._grid, this._puzzle);
            saved.download();
        }
    }
    undo() {
        if (this._puzzle !== undefined) {
            const solution = new PuzzleSolution(this._puzzle);
            for (let i = 0; i < this._puzzle.solution.length - 3; i++) {
                if (!solution.test(i, 0)) {
                    alert("Test failed");
                }
            }
        }
    }
    restorePoint() {
        // Silently ignore
    }
    redo() {
        this.generate(30, 40);
    }
    check() {
        let errors = 0;
        if (this._grid !== undefined) {
            var iterator = new GridIterator(this._grid);
            iterator.forEach((cell) => {
                if (!this._hasBlockCoverage(cell)) {
                    errors++;
                }
            });
        }
        console.log(`${errors} cell(s) don't have a block that influences its state.`);
    }
    clear() {
        if (this._grid !== undefined) {
            var blocks = new BlockIterator(this._grid);
            blocks.forEach(block => {
                block.clear();
            });
            var cells = new GridIterator(this._grid);
            var grid = this._grid;
            cells.forEach(cell => {
                grid.setStatus(cell, CellStatus.Empty);
            });
        }
    }
    solve() {
        if (this._grid !== undefined) {
            const randoms = PuzzleGenerator.getRandomNumbers(this._grid.numCols * this._grid.numRows);
            let i = 0;
            for (let y = 0; y < this._grid.numRows; y++) {
                for (let x = 0; x < this._grid.numCols; x++) {
                    if (randoms[i] > 127) {
                        this._pruneCell(x, y);
                    }
                    i++;
                }
            }
            for (let y = 0; y < this._grid.numRows; y++) {
                for (let x = 0; x < this._grid.numCols; x++) {
                    this._pruneCell(x, y);
                }
            }
            this._updateStatus();
        }
    }
    _pruneCell(x, y) {
        const cell = new GridCell(x, y);
        const block = this._grid.getBlock(cell);
        if ((block !== undefined) && (block.hint >= 0)) {
            block.toggleHint();
            if (!this._canBlockBeRemoved(block)) {
                // Oops, shouldn't have removed this block !
                block.toggleHint();
            }
        }
    }
    generate(columns, rows) {
        const saveGame = PuzzleGenerator.generateSaveGame(columns, rows);
        this._puzzle = PuzzleGenerator.saveGame2Puzzle(saveGame);
        this._grid = new Grid(this._width, this._height, this._puzzle);
        SaveGame.loadGame(saveGame, this._grid);
        this._view.setGrid(this._grid);
        const element = document.getElementById(this._gridId);
        if (element !== null) {
            const svg = element;
            new Cursor(svg, this, this._onCursor.bind(this));
        }
    }
    _onCursor(cell) {
        if (this._grid !== undefined && this._puzzle !== undefined && this._puzzle.solution !== undefined) {
            const sol = new PuzzleSolution(this._puzzle);
            sol.toggleStatus(cell);
            const newStatus = sol.getStatus(cell);
            this._grid.setStatus(cell, newStatus);
        }
    }
    _canBlockBeRemoved(block) {
        let canBeRemoved = true;
        const iterator = new MicroIterator(block.cell);
        iterator.forEach((cell) => {
            canBeRemoved = canBeRemoved && this._hasBlockCoverage(cell);
        });
        //console.log(`block at (${block.x}, ${block.y}) - ${canBeRemoved}`);
        return canBeRemoved;
    }
    _hasBlockCoverage(cell) {
        let found = 0;
        const iterator = new MicroIterator(cell);
        iterator.forEach((cell) => {
            const block = this._grid.getBlock(cell);
            if (block !== undefined && block.hint >= 0) {
                found++;
            }
        });
        //if (!found) console.log(`(${x}, ${y}) - ${found}`);
        return (found >= Editor.MinimumHintsPerBlock);
    }
    _updateStatus() {
        if (this._grid !== undefined) {
            const iterator = new GridIterator(this._grid);
            const grid = this._grid;
            iterator.forEach((cell) => {
                // Force change handler to run.
                grid.setStatus(cell, grid.getStatus(cell));
            });
        }
    }
}
Editor.MinimumHintsPerBlock = 2;
//# sourceMappingURL=editor.js.map