import { CellStatus, Grid } from "./grid.js";
import { GridCell } from "./grid-cell.js";

export class GridView {
    private _svg: SVGElement;
    private _grid: Grid;

    public static readonly svgNS = 'http://www.w3.org/2000/svg';
    private static readonly fontSizeFactor = 0.8;
    private static readonly fontBaselineFactor = 0.75;

    constructor(svg: SVGElement, grid: Grid) {
        this._svg = svg;
        this._grid = grid;
        this.drawGrid();
        this._grid.registerChangeHandler(this._onCellChanged.bind(this));
    }

    private drawGrid(): void {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                const cell = this._grid.getCell(x, y);
                if (cell !== undefined) {
                    this._drawCell(x, y);
                    this._updateCell(cell);
                }
            }
        }
    }

    private _updateCell(cell: GridCell) {
        const rect = document.getElementById(`cell-${cell.x}-${cell.y}`);
        const hint = document.getElementById(`hint-${cell.x}-${cell.y}`);
        const crossUp = document.getElementById(`crossup-${cell.x}-${cell.y}`);
        const crossDown = document.getElementById(`crossdown-${cell.x}-${cell.y}`);
        if (rect !== null && hint !== null && crossUp !== null && crossDown !== null) {
            switch(cell.status) {
                case CellStatus.Empty:
                    rect.setAttribute("class", "cellEmpty");
                    hint.setAttribute("class", "hintEmpty");
                    crossUp.setAttribute("class", "crossEmpty");
                    crossDown.setAttribute("class", "crossEmpty");
                    break;
                case CellStatus.Full:
                    rect.setAttribute("class", "cellFull");
                    hint.setAttribute("class", "hintFull");
                    crossUp.setAttribute("class", "crossFull");
                    crossDown.setAttribute("class", "crossFull");
                    break;
                case CellStatus.Unknown:
                default:
                    rect.setAttribute("class", "cellUnknown");
                    hint.setAttribute("class", "hintUnknown");
                    crossUp.setAttribute("class", "crossUnknown");
                    crossDown.setAttribute("class", "crossUnknown");
                    break;
            }
            if (cell.applied) {
                hint.classList.add("applied");
            } else {
                hint.classList.remove("applied");
            }
            if (cell.error) {
                hint.classList.add("hintError");
            } else {
                hint.classList.remove("hintError");
            }
            if (cell.hint >= 0) {
                hint.textContent = `${cell.hint}`;
            } else {
                hint.textContent = " ";
            }
        }
    }

    private _drawCell(x: number, y: number): void {
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

    private _drawRect(xPos: number, yPos: number): SVGRectElement {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${this._grid.cellSize}`);
        rect.setAttribute("height", `${this._grid.cellSize}`);
        rect.setAttribute("class", "cellUnknown");
        rect.onclick = this._onMouseClick.bind(this);
        this._svg.appendChild(rect);
        return rect;
    }

    private _drawHint(xPos: number, yPos: number): SVGTextElement {
        const text = document.createElementNS(GridView.svgNS, "text");
        text.setAttribute("x", `${xPos + (this._grid.cellSize / 2)}`);
        text.setAttribute("y", `${yPos + (this._grid.cellSize * GridView.fontBaselineFactor)}`);
        text.setAttribute("font-size", `${this._grid.cellSize * GridView.fontSizeFactor}`);
        text.setAttribute('text-anchor', "middle")
        text.setAttribute("class", "textUnknown");
        text.setAttribute("pointer-events", "none");
        const node = document.createTextNode(" ");
        text.appendChild(node);
        this._svg.appendChild(text);
        return text;
    }

    private _drawCross(xPos: number, yPos: number): SVGLineElement[] {
        const down = document.createElementNS(GridView.svgNS, "line");
        down.setAttribute("x1", `${xPos + 2}`);
        down.setAttribute("y1", `${yPos + 2}`);
        down.setAttribute("x2", `${xPos + this._grid.cellSize - 2}`);
        down.setAttribute("y2", `${yPos + this._grid.cellSize - 2}`);
        down.setAttribute("class", "crossUnknown");
        down.setAttribute("pointer-events", "none");
        this._svg.appendChild(down);
        const up = document.createElementNS(GridView.svgNS, "line");
        up.setAttribute("x1", `${xPos + this._grid.cellSize - 2}`);
        up.setAttribute("y1", `${yPos + 2}`);
        up.setAttribute("x2", `${xPos + 2}`);
        up.setAttribute("y2", `${yPos + this._grid.cellSize - 2}`);
        up.setAttribute("class", "crossUnknown");
        up.setAttribute("pointer-events", "none");
        this._svg.appendChild(up);
        return [down, up];
    }

    private _onMouseClick(e: MouseEvent): any {
        const target = e.target as SVGRectElement;
        if (target !== null) {
            const parts = target.id.split("-");
            if (parts.length > 2 && parts[0] === "cell") {
                const cell = this._grid.getCell(parseInt(parts[1]), parseInt(parts[2]));
                if (cell !== undefined) {
                    this._onCellClick(cell);
                }
            }
        }
    }

    private _onCellClick(cell: GridCell): void {
        cell.toggleStatus();
        this._grid.setCell(cell);
    }

    private _onCellChanged(cell: GridCell): void {
        this._updateCell(cell);
    }
}
