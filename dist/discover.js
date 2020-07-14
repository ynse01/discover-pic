import { Game } from "./game.js";
import { Editor } from "./editor.js";
export class DiscoverThePicture {
    constructor(gridId, editMode = false) {
        if (editMode) {
            this._game = new Editor(gridId);
        }
        else {
            this._game = new Game(gridId);
        }
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