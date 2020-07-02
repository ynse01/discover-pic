import { GridView } from "./grid-view.js";
export class Cursor {
    constructor(svg, game) {
        this._xPos = 1;
        this._yPos = 1;
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
        cursor.setAttribute("x", `${grid.getXPos(this._xPos - 1)}`);
        cursor.setAttribute("y", `${grid.getYPos(this._yPos - 1)}`);
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
            this._cursor.setAttribute("x", `${grid.getXPos(this._xPos - 1)}`);
            this._cursor.setAttribute("y", `${grid.getYPos(this._yPos - 1)}`);
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
                if (this._yPos + 1 < grid.numRows) {
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
                if (this._xPos + 1 < grid.numCols) {
                    this._xPos++;
                }
                break;
            case " ":
                const block = grid.getBlock(this._xPos, this._yPos);
                if (block !== undefined) {
                    block.applyHint();
                    // Force change handler to run.
                    grid.setStatus(this._xPos, this._yPos, grid.getStatus(this._xPos, this._yPos));
                    this._game.restorePoint();
                }
                break;
        }
        this._moveCursor();
    }
}
//# sourceMappingURL=cursor.js.map