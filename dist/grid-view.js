import { CellStatus } from "./grid.js";
export class GridView {
    constructor(svg, grid) {
        this._svg = svg;
        this._grid = grid;
        this.drawGrid();
        this._grid.registerChangeHandler(this._onCellChanged.bind(this));
    }
    drawGrid() {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                this._drawCell(x, y);
                this._setCellStatus(x, y);
                this._setCellContent(x, y);
            }
        }
    }
    _setCellStatus(x, y) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        const hint = document.getElementById(`hint-${x}-${y}`);
        const crossUp = document.getElementById(`crossup-${x}-${y}`);
        const crossDown = document.getElementById(`crossdown-${x}-${y}`);
        if (cell !== null && hint !== null && crossUp !== null && crossDown !== null) {
            const status = this._grid.getStatus(x, y);
            switch (status) {
                case CellStatus.Empty:
                    cell.setAttribute("class", "cellEmpty");
                    hint.setAttribute("class", "hintEmpty");
                    crossUp.setAttribute("class", "crossEmpty");
                    crossDown.setAttribute("class", "crossEmpty");
                    break;
                case CellStatus.Full:
                    cell.setAttribute("class", "cellFull");
                    hint.setAttribute("class", "hintFull");
                    crossUp.setAttribute("class", "crossFull");
                    crossDown.setAttribute("class", "crossFull");
                    break;
                case CellStatus.Unknown:
                default:
                    cell.setAttribute("class", "cellUnknown");
                    hint.setAttribute("class", "hintUnknown");
                    crossUp.setAttribute("class", "crossUnknown");
                    crossDown.setAttribute("class", "crossUnknown");
                    break;
            }
        }
    }
    _setCellApplied(x, y) {
        const cell = document.getElementById(`hint-${x}-${y}`);
        if (cell !== null) {
            const isApplied = this._grid.getApplied(x, y);
            if (isApplied) {
                cell.classList.add("applied");
            }
            else {
                cell.classList.remove("applied");
            }
        }
    }
    _setCellContent(x, y) {
        const cell = document.getElementById(`hint-${x}-${y}`);
        if (cell !== null) {
            const hint = this._grid.getHint(x, y);
            cell.textContent = hint;
        }
    }
    _drawCell(x, y) {
        const xPos = this._grid.getXPos(x);
        const yPos = this._grid.getYPos(y);
        const rect = this._drawRect(xPos, yPos);
        rect.setAttribute("id", `cell-${x}-${y}`);
        const cross = this._drawCross(xPos, yPos);
        cross[0].setAttribute("id", `crossdown-${x}-${y}`);
        cross[1].setAttribute("id", `crossup-${x}-${y}`);
        const text = this._drawHint(xPos, yPos);
        text.setAttribute("id", `hint-${x}-${y}`);
    }
    _drawRect(xPos, yPos) {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${this._grid.cellWidth}`);
        rect.setAttribute("height", `${this._grid.cellHeight}`);
        rect.setAttribute("class", "cellUnknown");
        rect.onclick = this._onMouseClick.bind(this);
        this._svg.appendChild(rect);
        return rect;
    }
    _drawHint(xPos, yPos) {
        const text = document.createElementNS(GridView.svgNS, "text");
        text.setAttribute("x", `${xPos + (this._grid.cellWidth / 2)}`);
        text.setAttribute("y", `${yPos + (this._grid.cellHeight * GridView.fontBaselineFactor)}`);
        text.setAttribute("font-size", `${this._grid.cellHeight * GridView.fontSizeFactor}`);
        text.setAttribute('text-anchor', "middle");
        text.setAttribute("class", "textUnknown");
        text.setAttribute("pointer-events", "none");
        const node = document.createTextNode(" ");
        text.appendChild(node);
        this._svg.appendChild(text);
        return text;
    }
    _drawCross(xPos, yPos) {
        const down = document.createElementNS(GridView.svgNS, "line");
        down.setAttribute("x1", `${xPos + 2}`);
        down.setAttribute("y1", `${yPos + 2}`);
        down.setAttribute("x2", `${xPos + this._grid.cellWidth - 2}`);
        down.setAttribute("y2", `${yPos + this._grid.cellHeight - 2}`);
        down.setAttribute("class", "crossUnknown");
        down.setAttribute("pointer-events", "none");
        this._svg.appendChild(down);
        const up = document.createElementNS(GridView.svgNS, "line");
        up.setAttribute("x1", `${xPos + this._grid.cellWidth - 2}`);
        up.setAttribute("y1", `${yPos + 2}`);
        up.setAttribute("x2", `${xPos + 2}`);
        up.setAttribute("y2", `${yPos + this._grid.cellHeight - 2}`);
        up.setAttribute("class", "crossUnknown");
        up.setAttribute("pointer-events", "none");
        this._svg.appendChild(up);
        return [down, up];
    }
    _onMouseClick(e) {
        const cell = e.target;
        if (cell !== null) {
            const parts = cell.id.split("-");
            if (parts.length > 2 && parts[0] === "cell") {
                this._onCellClick(parseInt(parts[1]), parseInt(parts[2]));
            }
        }
    }
    _onCellClick(x, y) {
        this._grid.toggleStatus(x, y);
        this._setCellStatus(x, y);
    }
    _onCellChanged(x, y) {
        this._setCellStatus(x, y);
        this._setCellContent(x, y);
        this._setCellApplied(x, y);
    }
}
GridView.svgNS = 'http://www.w3.org/2000/svg';
GridView.fontSizeFactor = 0.8;
GridView.fontBaselineFactor = 0.75;
//# sourceMappingURL=grid-view.js.map