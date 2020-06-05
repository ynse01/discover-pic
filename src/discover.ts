import { Grid } from "./grid.js";
import { GridView } from "./gridView.js";

export class DiscoverThePicture {
    private id: string;
    private grid: Grid | undefined;
    
    constructor(gridId: string) {
        this.id = gridId;
    }

    public init(): void {
        const element = document.getElementById(this.id);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this.id}.`);
        }
        const svg = <SVGElement><any>element;
        const width = (<any>svg)["viewBox"].baseVal.width;
        const height = (<any>svg)["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a size.`);
        }
        this.grid = new Grid(parseInt(width), parseInt(height));
        new GridView(svg, this.grid);
    }

}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;