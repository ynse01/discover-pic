
export class DiscoverThePicture {
    private id: string;
    private static readonly svgNS = 'http://www.w3.org/2000/svg';

    constructor(gridId: string) {
        this.id = gridId;
    }

    public init(): void {
        const numCols = 20;
        const numRows = 20;
        const grid = document.getElementById(this.id);
        if (grid == null) {
            console.log(`Unable to find SVG element with ID: ${this.id}.`);
            return;
        }
        this.drawGrid(<SVGElement><any>grid, numRows, numCols);
    }

    private drawGrid(grid: SVGElement, numRows: number, numCols: number): void {
        const width = grid.getAttribute("width");
        const height = grid.getAttribute("height");
        const padding = 5;
        if (width == null || height == null) {
            return;
        }
        const cellWidth = (parseInt(width) - 2 * padding) / numCols;
        const cellHeight = (parseInt(height) - 2 * padding) / numRows;
        for (let y = 0; y <= numRows; y++) {
            const minX = padding;
            const maxX = (cellWidth * numCols) + padding;
            this.drawLine(grid, minX, (y * cellHeight) + padding, maxX, (y * cellHeight) + padding, "gridLine");
        }
        for (let x = 0; x <= numCols; x++) {
            const minY = padding;
            const maxY = (cellHeight * numRows) + padding;
            this.drawLine(grid, (x * cellWidth) + padding, minY, (x * cellWidth) + padding, maxY, "gridLine");
        }
    }

    private drawLine(grid: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string): void {
        const line = document.createElementNS(DiscoverThePicture.svgNS, "line");
        line.setAttribute("x1", `${x1}`);
        line.setAttribute("x2", `${x2}`);
        line.setAttribute("y1", `${y1}`);
        line.setAttribute("y2", `${y2}`);
        line.setAttribute("class", cssClass);
        grid.appendChild(line);
    }
}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;