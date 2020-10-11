import { Clicker } from "../clicker.js";
import { CellStatus } from "../grid.js";
export class EditorClicker extends Clicker {
    constructor(game) {
        super(game);
        this.appliedStatus = CellStatus.Unknown;
    }
    onStart(cell) {
        var status = this._game.grid.getStatus(cell);
        switch (status) {
            case CellStatus.Unknown:
            case CellStatus.Empty:
                this.appliedStatus = CellStatus.Full;
                break;
            case CellStatus.Full:
                this.appliedStatus = CellStatus.Empty;
                break;
        }
    }
    onContinue(_cell) {
        if (this._cells !== undefined) {
            this._cells.forEach(cell => {
                var block = this._game.grid.getBlock(cell);
                if (block.hint >= 0) {
                    block.toggleHint();
                }
                this._game.grid.setStatus(cell, this.appliedStatus);
            });
        }
    }
    onStop(cell) {
        if (cell !== undefined) {
            this.onContinue(cell);
        }
    }
}
//# sourceMappingURL=editor-clicker.js.map