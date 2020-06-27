import { Game } from "./game.js";
import { Editor } from "./editor.js";

export interface IGame {
    load(url: string): void;

    toggleCursor(): boolean;

    saveGame(): void;

    check(): void;

    clear(): void;

    solve(): void;
}

export class DiscoverThePicture {
    private _game: IGame;
    
    constructor(gridId: string, editMode: boolean = false) {
        if (editMode) {
            this._game = new Editor(gridId);
        } else {
            this._game = new Game(gridId);
        }
    }

    public load(url: string): void {
        this._game.load(url);
    }

    public toggleCursor(): boolean {
        return this._game.toggleCursor();
    }

    public saveGame(): void {
        this._game.saveGame();
    }

    public check(): void {
        this._game.check();
    }

    public clear(): void {
        this._game.clear();
    }

    public solve(): void {
        this._game.solve();
    }
}
// Let HTML page easiliy access this class.
(<any>window).DiscoverThePicture = DiscoverThePicture;