import { Game } from "./game.js";
import { Editor } from "./creation/editor.js";
import { IGame } from "./i-game.js";
import { Thumbnail } from "./thumbnail.js";
import { IPuzzle } from "./i-puzzle.js";

export class DiscoverThePicture {
    private _game: IGame;
    
    constructor(gridId: string, editMode: boolean = false) {
        if (editMode) {
            this._game = new Editor(gridId);
        } else {
            this._game = new Game(gridId);
        }
    }

    public static thumbnail(url: string, cb: (name: string, width: number, height: number, dataURL: string | undefined) => void): void {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                var puzzle = JSON.parse(request.responseText) as IPuzzle;
                const thumbnail = new Thumbnail(puzzle);
                cb(puzzle.name, puzzle.rows[0].length, puzzle.rows.length, thumbnail.toDataURL());
            }
        }
        request.send(null);
    }

    public load(url: string): void {
        this._game.load(url);
    }

    public execute(command: string): void {
        switch (command) {
            case "cursor":
                this._game.toggleCursor();
                break;
            case "save":
                this._game.saveGame();
                break;
            case "undo":
                this._game.undo();
                break;
            case "redo":
                this._game.redo();
                break;
            case "check":
                this._game.check();
                break;
            case "clear":
                this._game.clear();
                break;
            case "solve":
                this._game.solve();
                break;
        }
    }
}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;