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
        cursor.setAttribute("x", `${this._grid.getXPos(this._xPos)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(this._yPos)}`);
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
            cursor.setAttribute("x", `${this._grid.getXPos(this._xPos)}`);
            cursor.setAttribute("y", `${this._grid.getYPos(this._yPos)}`);
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
                // For now, toggle the center cell.
                this._grid.toggleStatus(this._xPos + 1, this._yPos + 1);
                break;
        }
        this._moveCursor();
    }
}
//# sourceMappingURL=cursor.js.map