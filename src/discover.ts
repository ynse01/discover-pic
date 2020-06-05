import { Grid } from "./grid.js";
import { GridView } from "./gridView.js";
import { Cursor } from "./cursor.js";

export class DiscoverThePicture {
    private _id: string;
    private _grid: Grid | undefined;
    
    constructor(gridId: string) {
        this._id = gridId;
    }

    public init(): void {
        const element = document.getElementById(this._id);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._id}.`);
        }
        const svg = <SVGElement><any>element;
        const width: number = (<any>svg)["viewBox"].baseVal.width;
        const height: number = (<any>svg)["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        this._grid = new Grid(width, height);
        new GridView(svg, this._grid);
        new Cursor(svg, this._grid);
    }

}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;