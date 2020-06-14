export class NeighborIterator {
    constructor(grid, x, y) {
        this._grid = grid;
        this.x = x;
        this.y = y;
    }
    forEach(cb) {
        for (let y = -2; y <= 2; y++) {
            for (let x = -2; x <= 2; x++) {
                const block = this._grid.getBlock(this.x + x, this.y + y);
                if (block !== undefined) {
                    cb(block);
                }
            }
        }
    }
}
//# sourceMappingURL=neighbor-iterator.js.map