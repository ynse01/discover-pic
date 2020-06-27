import { Grid } from "./grid.js";
import { IPuzzle } from "./game.js";
import { GridView } from "./grid-view.js";


export class Editor {
    private _gridId: string;
    private _grid: Grid | undefined;

    constructor(gridId: string) {
        this._gridId = gridId;
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
        const puzzle = this.randomPuzzle(columns, rows);
        this._grid = new Grid(width, height, puzzle);
        new GridView(svg, this._grid);
    }

    private randomPuzzle(_columns: number, _rows: number): IPuzzle {
        return <IPuzzle>{};
    }
}