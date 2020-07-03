import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { IGame } from "./i-game.js";
import { PuzzleGenerator } from "./puzzle-generator.js";
import { Solver } from "./solver.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";
import { SaveHint } from "./save-hint.js";
import { GridIterator } from "./grid-iterator.js";
import { MicroIterator } from "./micro-iterator.js";


export class Editor implements IGame {
    private _gridId: string;
    private _grid: Grid | undefined;

    constructor(gridId: string) {
        this._gridId = gridId;
    }
    
    public get grid(): Grid {
        return this._grid!;
    }

    public load(_url: string): void {
        this.generate(45, 35);
    }
    
    public toggleCursor(): boolean {
        throw new Error("Method not implemented.");
    }
    
    public saveGame(): void {
        if (this._grid !== undefined) {
            var saved = SaveHint.fromGrid(this._grid);
            saved.download();
        }
    }
    
    public undo(): void {
        // Silently ignore
    }

    public restorePoint(): void {
        // Silently ignore
    }

    public redo(): void {
        // Silently ignore
    }

    public check(): void {
        let errors = 0;
        if (this._grid !== undefined) {
            var iterator = new GridIterator(this._grid);
            iterator.forEach((x, y) => {
                if (!this._hasBlockCoverage(x, y)) {
                    errors++;
                }
            });
        }
        console.log(`${errors} cell(s) don't have a block that influences its state.`);
    }
    
    public clear(): void {
        if (this._grid !== undefined) {
            var iterator = new BlockIterator(this._grid);
            iterator.forEach(block => {
                if (block.hint < 0) {
                    this._onCellClick(block.x, block.y);
                }
            });
        }
    }
    
    public solve(): void {
        if (this._grid !== undefined) {
            const solver = new Solver(this._grid);
            solver.solve();
        }
    }

    public generate(columns: number, rows: number): void {
        const element = document.getElementById(this._gridId);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._gridId}.`);
        }
        const svg = <SVGElement><any>element;
        const width: number = (<any>svg)["viewBox"].baseVal.width;
        const height: number = (<any>svg)["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        const saveGame = PuzzleGenerator.generateSaveGame(columns, rows);
        const puzzle = PuzzleGenerator.saveGame2Puzzle(saveGame);
        this._grid = new Grid(width, height, puzzle);
        SaveGame.loadGame(saveGame, this._grid);
        new GridView(svg, this, this._onCellClick.bind(this));
    }

    private _onCellClick(x: number, y: number): void {
        if (this._grid !== undefined) {
            var block = this._grid.getBlock(x, y);
            if (block !== undefined) {
                block.toggleHint();
                // Force change handler to run.
                this._grid.setStatus(x, y, this._grid.getStatus(x, y));
            }
        }
    }

    private _hasBlockCoverage(x: number, y: number): boolean {
        var found = false;
        var iterator = new MicroIterator(x, y);
        iterator.forEach((x, y) => {
            if (!found) {
                const block = this._grid!.getBlock(x, y);
                found = block !== undefined && block.hint >= 0;
            }
        });
        return found;
    }
}