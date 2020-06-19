import { Block } from "./block.js";

export class CommonWithNeighbor {
    private _block: Block;
    
    private static _overlaps = [9, 6, 3, 6, 4, 1, 3, 2, 1];

    constructor(block: Block) {
        this._block = block;
    }

    public find(): void {
        //const openCells = this._block.getNumberUnknownCells();
        this._block.neighbors.forEach(neighbor => {
            this._sizeOfOverlap(neighbor);
            //const neighborOpenCells = neighbor.getNumberUnknownCells();
            
        });
    }

    private _sizeOfOverlap(neighbor: Block): number {
        const xDelta = Math.abs(this._block.x - neighbor.x);
        const yDelta = Math.abs(this._block.y - neighbor.y);
        return CommonWithNeighbor._overlaps[xDelta + (3 * yDelta)];
    }
}