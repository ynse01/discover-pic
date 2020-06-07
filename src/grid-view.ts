import { CellStatus, Grid } from "./grid.js";

export class GridView {
    private _svg: SVGElement;
    private _grid: Grid;

    public static readonly svgNS = 'http://www.w3.org/2000/svg';

    constructor(svg: SVGElement, grid: Grid) {
        this._svg = svg;
        this._grid = grid;
        this.drawGrid();
        this._grid.registerChangeHandler(this._onCellChanged.bind(this));
    }

    private drawGrid(): void {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                this._drawCell(x, y);
                this._setCellStatus(x, y);
                this._setCellContent(x, y);
            }
        }
    }

    private _setCellStatus(x: number, y: number) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        const hint = document.getElementById(`hint-${x}-${y}`);
        if (cell !== null && hint !== null) {
            const status = this._grid.getStatus(x, y);
            switch(status) {
                case CellStatus.Empty:
                    cell.setAttribute("class", "cellEmpty");
                    hint.setAttribute("class", "hintEmpty");
                    break;
                case CellStatus.Full:
                    cell.setAttribute("class", "cellFull");
                    hint.setAttribute("class", "hintFull");
                    break;
                case CellStatus.Unknown:
                default:
                    cell.setAttribute("class", "cellUnknown");
                    hint.setAttribute("class", "hintUnknown");
                    break;
            }
        }
    }

    private _setCellContent(x: number, y: number) {
        const cell = document.getElementById(`hint-${x}-${y}`);
        if (cell !== null) {
            const hint = this._grid.getHint(x, y);
            cell.textContent = hint;
        }
    }

    private _drawCell(x: number, y: number): void {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        const xPos = this._grid.getXPos(x);
        const yPos = this._grid.getYPos(y);
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${this._grid.cellWidth}`);
        rect.setAttribute("height", `${this._grid.cellHeight}`);
        rect.setAttribute("class", "cellUnknown");
        rect.setAttribute("id", `cell-${x}-${y}`);
        rect.onclick = this._onMouseClick.bind(this);
        this._svg.appendChild(rect);
        const text = document.createElementNS(GridView.svgNS, "text");
        text.setAttribute("x", `${xPos + (this._grid.cellWidth / 2)}`);
        text.setAttribute("y", `${yPos + (this._grid.cellHeight * 0.80)}`);
        text.setAttribute("font-size", `${this._grid.cellHeight * 0.9}`);
        text.setAttribute('text-anchor', "middle")
        text.setAttribute("fill", "black");
        rect.setAttribute("class", "textUnknown");
        text.setAttribute("id", `hint-${x}-${y}`);
        text.setAttribute("pointer-events", "none");
        const node = document.createTextNode(" ");
        text.appendChild(node);
        this._svg.appendChild(text);
    }

    private _onMouseClick(e: MouseEvent): any {
        const cell = e.target as SVGRectElement;
        if (cell !== null) {
            const parts = cell.id.split("-");
            if (parts.length > 2 && parts[0] === "cell") {
                this._onCellClick(parseInt(parts[1]), parseInt(parts[2]));
            }
        }
    }

    private _onCellClick(x: number, y: number): void {
        this._grid.toggleStatus(x, y);
        this._setCellStatus(x, y);
    }

    private _onCellChanged(x: number, y: number): void {
        this._setCellStatus(x, y);
        this._setCellContent(x, y);
    }
}
