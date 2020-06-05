import { Grid } from "./grid.js";
import { GridView } from "./gridView.js";

export class Cursor {
    private _cursor: SVGRectElement;
    private _grid: Grid;
    private _visibility: boolean;
    private _xPos: number = 1;
    private _yPos: number = 1;

    constructor(svg: SVGElement, grid: Grid) {
        this._grid = grid; 
        this._visibility = false;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
        this._subscribe();
    }

    public get visibility(): boolean {
        return this._visibility;
    }

    public set visibility(value: boolean) {
        this._visibility = value;
    }

    private _drawCursor(): SVGRectElement {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos)}`);
        cursor.setAttribute("width", `${this._grid.cellWidth * 3}`);
        cursor.setAttribute("height", `${this._grid.cellHeight * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        return <SVGRectElement><any>cursor;
    }

    private _moveCursor(): void {
        const cursor = document.getElementById("cursor");
        if (cursor !== null) {
            cursor.setAttribute("x", `${this._grid.getXPos(this._xPos)}`);
            cursor.setAttribute("y", `${this._grid.getYPos(this._yPos)}`);
        }
    }

    private _subscribe() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }

    private _onKeyDown(e: KeyboardEvent): any {
        const args = e || window.event;
        switch(args.key) {
            case "Down":
            case "ArrowDown":
                if (this._yPos + 2 < this._grid.numRows) {
                    this._yPos++;
                }
                break;
            case "Up":
            case "ArrowUp":
                if (this._yPos >= 0) {
                    this._yPos--;
                }
                break;
            case "Left":
            case "ArrowLeft":
                if (this._xPos >= 0) {
                    this._xPos--;
                }
                break;
            case "Right":
            case "ArrowRight":
                if (this._xPos + 2 < this._grid.numCols) {
                    this._xPos++;
                }
                break;
            case " ":
                break;
        }
        this._moveCursor();
    }
}