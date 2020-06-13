export class BlockIterator {
    constructor(grid) {
        this._grid = grid;
    }
    forEach(cb) {
        for (let y = 0; y < this._grid.numRows; y++) {
            for (let x = 0; x < this._grid.numCols; x++) {
                const block = this._grid.getBlock(x, y);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }
    }
}
//# sourceMappingURL=block-iterator.js.map