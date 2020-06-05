import { CellStatus, Grid } from "./grid.js";

export class GridView {
    private svg: SVGElement;
    private grid: Grid;

    public static readonly svgNS = 'http://www.w3.org/2000/svg';

    constructor(svg: SVGElement, grid: Grid) {
        this.svg = svg;
        this.grid = grid;
        this.drawGrid();
    }

    private drawGrid(): void {
        for (let y = 0; y < this.grid.numRows; y++) {
            for (let x = 0; x < this.grid.numCols; x++) {
                this.drawCell(x, y);
                this.setCellStatus(x, y);
                this.setCellContent(x, y);
            }
        }
        for (let y = 0; y <= this.grid.numRows; y++) {
            const minX = Grid.padding;
            const maxX = (this.grid.cellWidth * this.grid.numCols) + Grid.padding;
            this.drawLine(minX, (y * this.grid.cellHeight) + Grid.padding, maxX, (y * this.grid.cellHeight) + Grid.padding, "gridLine");
        }
        for (let x = 0; x <= this.grid.numCols; x++) {
            const minY = Grid.padding;
            const maxY = (this.grid.cellHeight * this.grid.numRows) + Grid.padding;
            this.drawLine((x * this.grid.cellWidth) + Grid.padding, minY, (x * this.grid.cellWidth) + Grid.padding, maxY, "gridLine");
        }
    }

    public setCellStatus(x: number, y: number) {
        const cell = document.getElementById(`cell-${x}-${y}`);
        if (cell !== null) {
            const status = this.grid.getStatus(x, y);
            console.log(`Set status of (${x},${y}) to ${status}.`);
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

    private setCellContent(x: number, y: number) {
        const cell = document.getElementById(`text-${x}-${y}`);
        if (cell !== null) {
            const content = this.grid.getContent(x, y);
            cell.textContent = content;
        }
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number, cssClass: string): void {
        const line = document.createElementNS(GridView.svgNS, "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("class", cssClass);
        this.svg.appendChild(line);
    }

    private drawCell(x: number, y: number): void {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        const xPos = (x * this.grid.cellWidth) + Grid.padding;
        const yPos = (y * this.grid.cellHeight) + Grid.padding;
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${this.grid.cellWidth}`);
        rect.setAttribute("height", `${this.grid.cellHeight}`);
        rect.setAttribute("id", `cell-${x}-${y}`);
        this.svg.appendChild(rect);
        const text = document.createElementNS(GridView.svgNS, "text");
        text.setAttribute("x", `${xPos + (this.grid.cellWidth / 2)}`);
        text.setAttribute("y", `${yPos + (this.grid.cellHeight * 0.85)}`);
        text.setAttribute("font-size", `${this.grid.cellHeight}`);
        text.setAttribute('text-anchor', "middle")
        text.setAttribute("fill", "black");
        text.setAttribute("id", `text-${x}-${y}`);
        const node = document.createTextNode(" ");
        text.appendChild(node);
        this.svg.appendChild(text);
    }
}
