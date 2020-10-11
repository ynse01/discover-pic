import { Game } from "./game.js";
import { Editor } from "./creation/editor.js";
import { Thumbnail } from "./thumbnail.js";
export class DiscoverThePicture {
    constructor(gridId, editMode = false) {
        if (editMode) {
            this._game = new Editor(gridId);
        }
        else {
            this._game = new Game(gridId);
        }
    }
    static thumbnail(url, cb) {
        const request = new XMLHttpRequest();
        request.overrideMimeType("application/json");
        request.open("GET", url, true);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var puzzle = JSON.parse(request.responseText);
                const thumbnail = new Thumbnail(puzzle);
                cb(puzzle.name, puzzle.rows[0].length, puzzle.rows.length, thumbnail.toDataURL());
            }
        };
        request.send(null);
    }
    load(url) {
        this._game.load(url);
    }
    execute(command) {
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
window.DiscoverThePicture = DiscoverThePicture;
//# sourceMappingURL=discover.js.map