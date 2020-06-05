import { Grid } from "./grid.js";
import { GridView } from "./gridView.js";

export class Cursor {
    private _cursor: SVGRectElement;
    private _grid: Grid;
    private _visibility: boolean;

    constructor(svg: SVGElement, grid: Grid) {
        this._grid = grid; 
        this._visibility = false;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
    }

    public get visibility(): boolean {
        return this._visibility;
    }

    public set visibility(value: boolean) {
        this._visibility = value;
    }

    private _drawCursor(): SVGRectElement {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        cursor.setAttribute("x", `${this._grid.getXPos(2)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(2)}`);
        cursor.setAttribute("width", `${this._grid.cellWidth * 3}`);
        cursor.setAttribute("height", `${this._grid.cellHeight * 3}`);
        cursor.setAttribute("class", "cursor");
        return <SVGRectElement><any>cursor;
    }
}