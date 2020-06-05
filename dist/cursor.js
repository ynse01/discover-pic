import { GridView } from "./gridView.js";
export class Cursor {
    constructor(svg, grid) {
        this._grid = grid;
        this._visibility = false;
        this._cursor = this._drawCursor();
        svg.appendChild(this._cursor);
    }
    get visibility() {
        return this._visibility;
    }
    set visibility(value) {
        this._visibility = value;
    }
    _drawCursor() {
        const cursor = document.createElementNS(GridView.svgNS, "rect");
        cursor.setAttribute("x", `${this._grid.getXPos(2)}`);
        cursor.setAttribute("y", `${this._grid.getYPos(2)}`);
        cursor.setAttribute("width", `${this._grid.cellWidth * 3}`);
        cursor.setAttribute("height", `${this._grid.cellHeight * 3}`);
        cursor.setAttribute("class", "cursor");
        return cursor;
    }
}
//# sourceMappingURL=cursor.js.map