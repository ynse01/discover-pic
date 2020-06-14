import { BlockIterator } from "./block-iterator.js";
export class Solver {
    constructor(grid) {
        this._grid = grid;
    }
    solve() {
        let previousCount = this._countBlocks() + 1;
        let count = previousCount - 1;
        while (count < previousCount) {
            this._applyTrivialBlocks();
            previousCount = count;
            count = this._countOpenBlocks();
        }
        console.log(`${count} hints still open.`);
    }
    _applyTrivialBlocks() {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                block.applyHint(false);
            }
        });
    }
    _countBlocks() {
        let count = 0;
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(_block => {
            count++;
        });
        return count;
    }
    _countOpenBlocks(checkFirst = false) {
        let count = 0;
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (checkFirst) {
                block.checkApplied();
            }
            if (!block.applied) {
                count++;
            }
        });
        return count;
    }
}
//# sourceMappingURL=solver.js.map