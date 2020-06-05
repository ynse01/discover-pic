
export class Grid {
    private svg: SVGElement;
    private numCols: number;
    private numRows: number;
    private cellWidth: number;
    private cellHeight: number;

    private static readonly svgNS = 'http://www.w3.org/2000/svg';
    private static readonly padding = 5;

    constructor(svg: SVGElement, numCols: number, numRows: number) {
        this.svg = svg;
        this.numCols = numCols;
        this.numRows = numRows;
        const width = svg.getAttribute("width");
        const height = svg.getAttribute("height");
        if (width == null || height == null) {
            throw new Error("No width or height in SVG Element");
        }
        this.cellWidth = (parseInt(width) - 2 * Grid.padding) / numCols;
        this.cellHeight = (parseInt(height) - 2 * Grid.padding) / numRows;
    }

    public drawGrid(): void {
        for (let y = 0; y < this.numRows; y++) {
            for (let x = 0; x < this.numCols; x++) {
                this.drawCell(x, y);
            }
        }
        for (let y = 0; y <= this.numRows; y++) {
            const minX = Grid.padding;
            const maxX = (this.cellWidth * this.numCols) + Grid.padding;
            this.drawLine(minX, (y * this.cellHeight) + Grid.padding, maxX, (y * this.cellHeight) + Grid.padding, "gridLine");
        }
        for (let x = 0; x <= this.numCols; x++) {
            const minY = Grid.padding;
            const maxY = (this.cellHeight * this.numRows) + Grid.padding;
            this.drawLine((x * this.cellWidth) + Grid.padding, minY, (x * this.cellWidth) + Grid.padding, maxY, "gridLine");
        }
    }

    private drawLine(x1: number, y1: number, x2: number, y2: number, cssClass: string): void {
        const line = document.createElementNS(Grid.svgNS, "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("class", cssClass);
        this.svg.appendChild(line);
    }

    private drawCell(x: number, y: number): void {
        const rect = document.createElementNS(Grid.svgNS, "rect");
        rect.setAttribute("x", `${(x * this.cellWidth) + Grid.padding}`);
        rect.setAttribute("y", `${(y * this.cellHeight) + Grid.padding}`);
        rect.setAttribute("width", `${this.cellWidth}`);
        rect.setAttribute("height", `${this.cellHeight}`);
        rect.setAttribute("class", "cellUnknown");
        this.svg.appendChild(rect);
    }
}
