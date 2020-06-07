import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";

export class DiscoverThePicture {
    private _id: string;
    private _grid: Grid | undefined;
    
    constructor(gridId: string) {
        this._id = gridId;
    }

    public load(url: string): void {
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
        this.loadJson(url, (puzzle) => {
            this._grid = new Grid(width, height, puzzle);
            new GridView(svg, this._grid);
            new Cursor(svg, this._grid);    
        });
    }

    private loadJson(url: string, cb: (loaded: any)=> void) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                cb(JSON.parse(request.responseText));
            }
        }
        request.send(null);
    }
}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;