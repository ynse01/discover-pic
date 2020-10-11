import { GridView } from "./grid-view.js";
import { IGame } from "./i-game.js";
import { GridCell } from "./grid-cell.js";

export class Cursor {
    private _cursor: SVGRectElement;
    private _game: IGame;
    private _visibility: boolean;
    private _cell = new GridCell(1, 1);
    private _cb: (cell: GridCell) => void;

    constructor(svg: SVGElement, game: IGame, cb: (cell: GridCell) => void) {
        this._game = game; 
        this._cb = cb;
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
        const grid = this._game.grid;
        cursor.setAttribute("x", `${grid.getXPos(this._cell.x - 1)}`);
        cursor.setAttribute("y", `${grid.getYPos(this._cell.y - 1)}`);
        cursor.setAttribute("width", `${grid.cellSize * 3}`);
        cursor.setAttribute("height", `${grid.cellSize * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return <SVGRectElement><any>cursor;
    }

    private _moveCursor(): void {
        if (this._cursor !== undefined) {
            const grid = this._game.grid;
            this._cursor.setAttribute("x", `${grid.getXPos(this._cell.x - 1)}`);
            this._cursor.setAttribute("y", `${grid.getYPos(this._cell.y - 1)}`);
        }
    }

    private _subscribe() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }

    private _onKeyDown(e: KeyboardEvent): any {
        const args = e || window.event;
        const grid = this._game.grid;
        switch(args.key) {
            case "Down":
            case "ArrowDown":
                if (this._cell.y + 1 < grid.numRows) {
                    this._cell = this._cell.add(0, 1);
                }
                break;
            case "Up":
            case "ArrowUp":
                if (this._cell.y > 0) {
                    this._cell = this._cell.add(0, -1);
                }
                break;
            case "Left":
            case "ArrowLeft":
                if (this._cell.x > 0) {
                    this._cell = this._cell.add(-1, 0);
                }
                break;
            case "Right":
            case "ArrowRight":
                if (this._cell.x + 1 < grid.numCols) {
                    this._cell = this._cell.add(1, 0);
                }
                break;
            case " ":
                this._cb(this._cell);
                break;
        }
        this._moveCursor();
    }
}