import { Grid, CellStatus } from "./grid.js";

export class MicroSolver {
    private _grid: Grid;
    private _x: number;
    private _y: number;

    constructor(grid: Grid, x: number, y: number) {
        this._grid = grid;
        this._x = x;
        this._y = y;
    }

    public applyHint(): boolean {
        let isApplied = true;
        const hint = this._grid.getHint(this._x, this._y);
        switch(hint) {
            case "0":
                this._settAllCells(CellStatus.Empty);
                break;
            case "9":
                this._settAllCells(CellStatus.Full);
                break;
            default:
                isApplied = false;
                break;
        }
        return isApplied;
    }

    private _settAllCells(status: CellStatus) {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                this._grid.setStatus(this._x + x, this._y + y, status);
            }
        }
    }
}