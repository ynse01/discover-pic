import { Grid, CellStatus } from "./grid.js";
import { GridView } from "./grid-view.js";
import { GridCell } from "./grid-cell.js";
import { MicroIterator } from "./micro-iterator.js";

export class Cursor {
    private _cursor: SVGRectElement;
    private _grid: Grid;
    private _visibility: boolean;
    private _xPos: number = 1;
    private _yPos: number = 1;

    constructor(svg: SVGElement, grid: Grid) {
        this._grid = grid; 
        this._visibility = true;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
        this._subscribe();
    }

    public get visibility(): boolean {
        return this._visibility;
    }

    public set visibility(value: boolean) {
        if (value) {
            this._cursor.classList.remove("cursorHide");
        } else {
            this._cursor.classList.add("cursorHide");
        }
        this._visibility = value;
    }

    private _drawCursor(): SVGRectElement {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
        cursor.setAttribute("width", `${this._grid.cellSize * 3}`);
        cursor.setAttribute("height", `${this._grid.cellSize * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return <SVGRectElement><any>cursor;
    }

    private _moveCursor(): void {
        if (this._cursor !== undefined) {
            this._cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
            this._cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
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
                const cell = this._grid.getCell(this._xPos, this._yPos)
                if (cell !== undefined && cell.hint >= 0) {
                    cell.applied = true;
                    this._grid.setCell(cell);
                    const status = (cell.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                    this._setUnknownCells(status);
                }
                break;
        }
        this._moveCursor();
    }

    private _setUnknownCells(status: CellStatus) {
        const iterator = new MicroIterator(this._grid, this._xPos, this._yPos);
        iterator.foreach((cell: GridCell) => {
            if (cell.status === CellStatus.Unknown) {
                cell.status = status;
                this._grid.setCell(cell);
            }
        });
    }
}