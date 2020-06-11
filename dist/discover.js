import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";
import { SaveGame } from "./save-game.js";
export class DiscoverThePicture {
    constructor(gridId) {
        this._id = gridId;
    }
    load(url) {
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
        this.loadPuzzle(url, (puzzle) => {
            this._grid = new Grid(width, height, puzzle);
            this.loadSavedGame();
            new GridView(svg, this._grid);
            new Cursor(svg, this._grid);
        });
    }
    saveGame() {
        if (this._grid !== undefined) {
            const game = SaveGame.fromGrid(this._grid);
            const json = JSON.stringify(game);
            window.localStorage.setItem(this._grid["name"], json);
        }
    }
    clear() {
        if (this._grid !== undefined) {
            this._grid.clearGame();
        }
    }
    loadPuzzle(url, cb) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                cb(JSON.parse(request.responseText));
            }
        };
        request.send(null);
    }
    loadSavedGame() {
        if (this._grid !== undefined) {
            const saveGame = window.localStorage.getItem(this._grid.name);
            SaveGame.loadGame(saveGame, this._grid);
        }
    }
}
// Let HTML page easiliy access this class.
window.DiscoverThePicture = DiscoverThePicture;
//# sourceMappingURL=discover.js.map