import { CellStatus, Grid } from "./grid.js";

export class GridView {
    private _svg: SVGElement;
    private _grid: Grid;

    public static readonly svgNS = 'http://www.w3.org/2000/svg';

    constructor(svg: SVGElement, grid: Grid) {
        this._svg = svg;
        this._grid = grid;
        this.drawGrid();
    }

    private drawGrid(): void {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                this._drawCell(x, y);
                this._setCellStatus(x, y);
                this._setCellContent(x, y);
            }
        }
        for (let y = 0; y <= this._grid.numRows; y++) {
            const minX = this._grid.getXPos(0);
            const maxX = this._grid.getXPos(this._grid.numCols);
            const yPos = this._grid.getYPos(y);
            this._drawLine(minX, yPos, maxX, yPos, "gridLine");
        }
        for (let x = 0; x <= this._grid.numCols; x++) {
            const minY = this._grid.getYPos(0);
            const maxY = this._grid.getYPos(this._grid.numRows);
            const xPos = this._grid.getXPos(x);
            this._drawLine(xPos, minY, xPos, maxY, "gridLine");
        }
    }

    private _setCellStatus(x: number, y: number) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        if (cell !== null) {
            const status = this._grid.getStatus(x, y);
            switch(status) {
                case CellStatus.Empty:
                    cell.setAttribute("class", "cellEmpty");
                    break;
                case CellStatus.Full:
                    cell.setAttribute("class", "cellFull");
                    break;
                case CellStatus.Unknown:
                default:
                    cell.setAttribute("class", "cellUnknown");
                    break;
            }
        }
    }

    private _setCellContent(x: number, y: number) {
        const cell = document.getElementById(`text-${x}-${y}`);
        if (cell !== null) {
            const content = this._grid.getContent(x, y);
            cell.textContent = content;
        }
    }

    private _drawLine(x1: number, y1: number, x2: number, y2: number, cssClass: string): void {
        const line = document.createElementNS(GridView.svgNS, "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("class", cssClass);
        this._svg.appendChild(line);
    }

    private _drawCell(x: number, y: number): void {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        const xPos = this._grid.getXPos(x);
        const yPos = this._grid.getYPos(y);
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${this._grid.cellWidth}`);
        rect.setAttribute("height", `${this._grid.cellHeight}`);
        rect.setAttribute("id", `cell-${x}-${y}`);
        rect.onclick = this._onMouseClick.bind(this);
        this._svg.appendChild(rect);
        const text = document.createElementNS(GridView.svgNS, "text");
        text.setAttribute("x", `${xPos + (this._grid.cellWidth / 2)}`);
        text.setAttribute("y", `${yPos + (this._grid.cellHeight * 0.85)}`);
        text.setAttribute("font-size", `${this._grid.cellHeight}`);
        text.setAttribute('text-anchor', "middle")
        text.setAttribute("fill", "black");
        text.setAttribute("id", `text-${x}-${y}`);
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
        console.log(`Clicked on cell (${x}, ${y}).`);
    }
}
