import { Grid, CellStatus } from "./grid.js";
import { GridView } from "./grid-view.js";

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
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
        cursor.setAttribute("width", `${this._grid.cellWidth * 3}`);
        cursor.setAttribute("height", `${this._grid.cellHeight * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return <SVGRectElement><any>cursor;
    }

    private _moveCursor(): void {
        const cursor = document.getElementById("cursor");
        if (cursor !== null) {
            cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
            cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
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
                if (this._yPos + 1 < this._grid.numRows) {
                    this._yPos++;
                }
                break;
            case "Up":
            case "ArrowUp":
                if (this._yPos > 0) {
                    this._yPos--;
                }
                break;
            case "Left":
            case "ArrowLeft":
                if (this._xPos > 0) {
                    this._xPos--;
                }
                break;
            case "Right":
            case "ArrowRight":
                if (this._xPos + 1 < this._grid.numCols) {
                    this._xPos++;
                }
                break;
            case " ":
                this._apply();
                break;
        }
        this._moveCursor();
    }

    private _apply(): void {
        const hint = this._grid.getHint(this._xPos, this._yPos);
        switch(hint) {
            case "0":
                this._settAllCells(CellStatus.Empty);
                break;
            case "9":
                this._settAllCells(CellStatus.Full);
                break;
            default:
                // Do nothing.
                break;
        }
    }

    private _settAllCells(status: CellStatus) {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                this._grid.setStatus(this._xPos + x, this._yPos + y, status);
            }
        }
    }
}