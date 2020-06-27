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
    toggleCursor() {
        return this._game.toggleCursor();
    }
    saveGame() {
        this._game.saveGame();
    }
    check() {
        this._game.check();
    }
    clear() {
        this._game.clear();
    }
    solve() {
        this._game.solve();
    }
}
// Let HTML page easiliy access this class.
window.DiscoverThePicture = DiscoverThePicture;
//# sourceMappingURL=discover.js.map