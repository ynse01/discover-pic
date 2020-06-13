import { CellStatus } from "./grid.js";
import { GridView } from "./grid-view.js";
import { MicroIterator } from "./micro-iterator.js";
export class Cursor {
    constructor(svg, grid) {
        this._xPos = 1;
        this._yPos = 1;
        this._grid = grid;
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
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
        cursor.setAttribute("width", `${this._grid.cellSize * 3}`);
        cursor.setAttribute("height", `${this._grid.cellSize * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return cursor;
    }
    _moveCursor() {
        if (this._cursor !== undefined) {
            this._cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
            this._cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
        }
    }
    _subscribe() {
        document.addEventListener("keydown", this._onKeyDown.bind(this));
    }
    _onKeyDown(e) {
        const args = e || window.event;
        switch (args.key) {
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
                const block = this._grid.getBlock(this._xPos, this._yPos);
                if (block !== undefined) {
                    const status = (block.hint > 4) ? CellStatus.Full : CellStatus.Empty;
                    this._setUnknownCells(status);
                    block.applied = true;
                    // Force change handler to run.
                    this._grid.setStatus(this._xPos, this._yPos, this._grid.getStatus(this._xPos, this._yPos));
                }
                break;
        }
        this._moveCursor();
    }
    _setUnknownCells(status) {
        const iterator = new MicroIterator(this._xPos, this._yPos);
        iterator.forEach((x, y) => {
            if (this._grid.getStatus(x, y) === CellStatus.Unknown) {
                this._grid.setStatus(x, y, status);
            }
        });
    }
}
//# sourceMappingURL=cursor.js.map