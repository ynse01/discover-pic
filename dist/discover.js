import { Grid } from "./grid.js";
import { GridView } from "./gridView.js";
import { Cursor } from "./cursor.js";
export class DiscoverThePicture {
    constructor(gridId) {
        this._id = gridId;
    }
    init() {
        const element = document.getElementById(this._id);
        if (element == null) {
            throw new Error(`Unable to find SVG element with ID: ${this._id}.`);
        }
        const svg = element;
        const width = svg["viewBox"].baseVal.width;
        const height = svg["viewBox"].baseVal.height;
        if (width == null || height == null) {
            throw new Error(`SVG Element doesn't have a viewBox.`);
        }
        this._grid = new Grid(width, height);
        new GridView(svg, this._grid);
        new Cursor(svg, this._grid);
    }
}
// Let HTML page easiliy access this class.
window.DiscoverThePicture = DiscoverThePicture;
//# sourceMappingURL=discover.js.map