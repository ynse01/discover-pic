import { GridView } from "./grid-view.js";
import { GridCell } from "./grid-cell.js";
export class Cursor {
    constructor(svg, game) {
        this._cell = new GridCell(1, 1);
        this._game = game;
        this._visibility = true;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
        this._subscribe();
    }
    get visibility() {
        return this._visibility;
    }
    set visibility(value) {
        if (value) {
            this._cursor.classList.remove("cursorHide");
        }
        else {
            this._cursor.classList.add("cursorHide");
        }
        this._visibility = value;
    }
    _drawCursor() {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        const grid = this._game.grid;
        cursor.setAttribute("x", `${grid.getXPos(this._cell.x - 1)}`);
        cursor.setAttribute("y", `${grid.getYPos(this._cell.y - 1)}`);
        cursor.setAttribute("width", `${grid.cellSize * 3}`);
        cursor.setAttribute("height", `${grid.cellSize * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return cursor;
    }
    _moveCursor() {
        if (this._cursor !== undefined) {
            const grid = this._game.grid;
            this._cursor.setAttribute("x", `${grid.getXPos(this._cell.x - 1)}`);
            this._cursor.setAttribute("y", `${grid.getYPos(this._cell.y - 1)}`);
        }
    }
    _subscribe() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }
    _onKeyDown(e) {
        const args = e || window.event;
        const grid = this._game.grid;
        switch (args.key) {
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
                if (this._cell.y + 1 < grid.numCols) {
                    this._cell = this._cell.add(1, 0);
                }
                break;
            case " ":
                const block = grid.getBlock(this._cell);
                if (block !== undefined) {
                    block.applyHint();
                    // Force change handler to run.
                    grid.setStatus(this._cell, grid.getStatus(this._cell));
                    this._game.restorePoint();
                }
                break;
        }
        this._moveCursor();
    }
}
//# sourceMappingURL=cursor.js.map