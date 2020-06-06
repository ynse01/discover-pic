import { CellStatus } from "./grid.js";
import { GridView } from "./gridView.js";
export class Cursor {
    constructor(svg, grid) {
        this._xPos = 1;
        this._yPos = 1;
        this._grid = grid;
        this._visibility = false;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
        this._subscribe();
    }
    get visibility() {
        return this._visibility;
    }
    set visibility(value) {
        this._visibility = value;
    }
    _drawCursor() {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
        cursor.setAttribute("width", `${this._grid.cellWidth * 3}`);
        cursor.setAttribute("height", `${this._grid.cellHeight * 3}`);
        cursor.setAttribute("id", "cursor");
        cursor.setAttribute("class", "cursor");
        cursor.setAttribute("pointer-events", "none");
        return cursor;
    }
    _moveCursor() {
        const cursor = document.getElementById("cursor");
        if (cursor !== null) {
            cursor.setAttribute("x", `${this._grid.getXPos(this._xPos - 1)}`);
            cursor.setAttribute("y", `${this._grid.getYPos(this._yPos - 1)}`);
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
                this._apply();
                break;
        }
        this._moveCursor();
    }
    _apply() {
        const hint = this._grid.getContent(this._xPos, this._yPos);
        if (hint !== " ") {
            switch (hint) {
                case "0":
                    this._settAllCells(CellStatus.Empty);
                    break;
                case "9":
                    this._settAllCells(CellStatus.Full);
                    break;
            }
        }
    }
    _settAllCells(status) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                this._grid.setStatus(this._xPos + x, this._yPos + y, status);
            }
        }
    }
}
//# sourceMappingURL=cursor.js.map