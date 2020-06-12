import { Grid } from "./grid.js";
import { GridView } from "./grid-view.js";
import { Cursor } from "./cursor.js";
import { SaveGame } from "./save-game.js";

export class DiscoverThePicture {
    private _id: string;
    private _grid: Grid | undefined;
    private _cursor: Cursor | undefined;
    
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
        this.loadPuzzle(url, (puzzle) => {
            this._grid = new Grid(width, height, puzzle);
            this.loadSavedGame();
            new GridView(svg, this._grid);
            this._cursor = new Cursor(svg, this._grid);    
        });
    }

    public toggleCursor(): boolean {
        let visibility = false;
        const cursor = this._cursor;
        if (cursor !== undefined) {
            cursor.visibility = !cursor.visibility;
            visibility = cursor.visibility;
        }
        return visibility;
    }

    public saveGame() {
        if (this._grid !== undefined) {
            const game = SaveGame.fromGrid(this._grid);
            const json = JSON.stringify(game);
            window.localStorage.setItem(this._grid["name"], json);
        }
    }

    public check(): void {
        if (this._grid !== undefined) {
            this._grid.checkErrors();
        }
    }

    public clear(): void {
        if (this._grid !== undefined) {
            this._grid.clearGame();
        }
    }

    private loadPuzzle(url: string, cb: (loaded: any)=> void) {
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

    private loadSavedGame(): void {
        if (this._grid !== undefined) {
            const saveGame = <SaveGame><any>window.localStorage.getItem(this._grid.name);
            SaveGame.loadGame(saveGame, this._grid);
        }
    }
}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;