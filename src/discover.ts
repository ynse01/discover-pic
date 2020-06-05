import { Grid } from "./grid.js";

export class DiscoverThePicture {
    private id: string;
    private grid: Grid | undefined;

    constructor(gridId: string) {
        this.id = gridId;
    }

    public init(): void {
        const numCols = 20;
        const numRows = 20;
        const svg = document.getElementById(this.id);
        if (svg == null) {
            throw new Error(`Unable to find SVG element with ID: ${this.id}.`);
        }
        this.grid = new Grid(<SVGElement><any>svg, numRows, numCols);
        this.grid.drawGrid();
    }

}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;