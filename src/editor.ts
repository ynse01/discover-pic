import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { IGame } from "./discover.js";
import { PuzzleGenerator } from "./puzzle-generator.js";
import { Solver } from "./solver.js";
import { SaveGame } from "./save-game.js";
import { BlockIterator } from "./block-iterator.js";


export class Editor implements IGame {
    private _gridId: string;
    private _grid: Grid | undefined;

    constructor(gridId: string) {
        this._gridId = gridId;
    }
    
    public load(_url: string): void {
        this.generate(45, 35);
    }
    
    public toggleCursor(): boolean {
        throw new Error("Method not implemented.");
    }
    
    public saveGame(): void {
        throw new Error("Method not implemented.");
    }
    
    public check(): void {
        throw new Error("Method not implemented.");
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
        new GridView(svg, this._grid, this._onCellClick.bind(this));
    }

    private _onCellClick(x: number, y: number): void {
        if (this._grid !== undefined) {
            var block = this._grid.getBlock(x, y);
            if (block !== undefined) {
                block.toggleHint();
                this._grid.setStatus(x, y, this._grid.getStatus(x, y));
            }
        }
    }
}