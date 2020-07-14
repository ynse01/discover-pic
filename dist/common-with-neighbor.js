export class CommonWithNeighbor {
    constructor(block) {
        this._block = block;
    }
    find() {
        //const openCells = this._block.getNumberUnknownCells();
        this._block.neighbors.forEach(neighbor => {
            this._sizeOfOverlap(neighbor);
            //const neighborOpenCells = neighbor.getNumberUnknownCells();
        });
    }
    _sizeOfOverlap(neighbor) {
        const xDelta = Math.abs(this._block.cell.x - neighbor.cell.x);
        const yDelta = Math.abs(this._block.cell.y - neighbor.cell.y);
        return CommonWithNeighbor._overlaps[xDelta + (3 * yDelta)];
    }
}
CommonWithNeighbor._overlaps = [9, 6, 3, 6, 4, 1, 3, 2, 1];
//# sourceMappingURL=common-with-neighbor.js.map