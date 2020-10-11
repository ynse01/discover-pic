import { CellStatus, Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";
import { IGame } from "./i-game.js";
import { UndoStack } from "./undo-stack.js";
import { GameClicker } from "./game-clicker.js";
import { IPuzzle } from "./i-puzzle.js";
import { PuzzleSolution } from "./puzzle-solution.js";
import { MicroIterator } from "./micro-iterator.js";
import { GridIterator } from "./grid-iterator.js";

export class Game implements IGame {
    private _id: string;
    private _grid: Grid | undefined;
    private _cursor: Cursor | undefined;
    private _undo: UndoStack | undefined;
    private _solution: PuzzleSolution | undefined;

    constructor(gridId: string) {
        this._id = gridId;
    }

    public load(url: string): void {
        console.log(`Loading puzzle from ${url}`);
        const element = document.getElementById(this._id);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._id}.`);
        }
        const svg = <SVGElement><any>element;
        const width: number = (<any>svg)["viewBox"].baseVal.width;
        const height: number = (<any>svg)["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        this.loadPuzzle(url, (puzzle) => {
            this._grid = new Grid(width, height, <IPuzzle>puzzle);
            this.loadSavedGame();
            const view = new GridView(svg, new GameClicker(this));
            view.setGrid(this._grid);
            this._cursor = new Cursor(svg, this);    
            this._undo = new UndoStack(this._grid);
            this._solution = new PuzzleSolution(puzzle);
            this.restorePoint();
        });
    }

    public toggleCursor(): boolean {
        let visibility = false;
        const cursor = this._cursor;
        if (cursor !== undefined) {
            cursor.visibility = !cursor.visibility;
            visibility = cursor.visibility;
        }
        return visibility;
    }

    public get grid(): Grid {
        return this._grid!;
    }

    public saveGame() {
        if (this._grid !== undefined) {
            const game = SaveGame.fromGrid(this._grid);
            const json = JSON.stringify(game);
            window.localStorage.setItem(this._grid["name"], json);
        }
    }

    public restorePoint(): void {
        this._undo?.save();
    }

    public undo(): void {
        this._undo?.undo();
    }

    public redo(): void {
        this._undo?.redo();
    }

    public check(): void {
        if (this._grid !== undefined) {
            var iterator = new BlockIterator(this._grid);
            if (this._solution !== undefined) {
                iterator.forEach(block => {
                    if (block.hint >= 0) {
                        var blockIterator = new MicroIterator(block.cell);
                        var hasError = false;
                        blockIterator.forEach(cell => {
                            if (this._grid!.inRange(cell)) {
                                var gridStatus = this._grid!.getStatus(cell);
                                var solutionStatus = this._solution!.getStatus(cell);
                                hasError = hasError || !this.areAllowedStatuses(gridStatus, solutionStatus);
                            }
                        });
                        if (hasError) {
                            block.error = true;
                            // Refresh the state
                            this._grid!.setStatus(block.cell, this._grid!.getStatus(block.cell));
                        }
                    }
                });
            }
        }
    }

    public clear(): void {
        if (this._grid !== undefined) {
            this._grid.clearGame();
        }
    }

    public solve(): void {
        if (this._grid !== undefined && this._solution !== undefined) {
            // Override current status with the solution.
            var gridIterator = new GridIterator(this._grid);
            gridIterator.forEach(cell => {
                var solutionStatus = this._solution!.getStatus(cell);
                this._grid!.setStatus(cell, solutionStatus);
            });
        }
    }

    private loadPuzzle(url: string, cb: (loaded: any)=> void) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                cb(JSON.parse(request.responseText));
            }
        }
        request.send(null);
    }

    private loadSavedGame(): void {
        if (this._grid !== undefined) {
            const savedString = window.localStorage.getItem(this._grid.name);
            if (savedString !== null) {
                const saveGame = JSON.parse(savedString);
                SaveGame.loadGame(saveGame, this._grid);
                this.checkApplied();
            }
        }
    }

    private checkApplied(): void {
        if (this._grid !== undefined) {
            const iterator = new BlockIterator(this._grid);
            iterator.forEach(block => {
                block.checkApplied();
            });
        }
    }

    // Compare the current grid status, with the solution's status.
    private areAllowedStatuses(gridStatus: CellStatus, solutionStatus: CellStatus): boolean {
        let result = false;
        if (gridStatus === CellStatus.Unknown) {
            result = true;
        } else if (gridStatus === solutionStatus) {
            result = true;
        }
        return result;
    }
}
