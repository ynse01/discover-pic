import { Grid } from "./grid.js";
import { BlockIterator } from "./block-iterator.js";
import { CommonWithNeighbor } from "./common-with-neighbor.js";
import { BlockSolutions } from "./block-solutions.js";

export class Solver {
    private _grid: Grid;
    private _solutions: BlockSolutions[] | undefined;

    constructor(grid: Grid) {
        this._grid = grid;
        this._solutions = undefined;
    }

    public solve(): void {
        let previousCount = this._countBlocks() + 1;
        let count = previousCount - 1;
        while(count < previousCount) {
            this._applyTrivialBlocks();
            previousCount = count;
            count = this._countOpenBlocks();
        }
        if (count > 0) {
            console.log(`Trying harder...`);
            this._generateBlockSolutions();
            this._solutions?.forEach(solution => {
                if (solution.count <= 1) {
                    console.log(`Block at position (${solution.block.x}, ${solution.block.y}) has ${solution.count} solutions left.`);
                }
            });
            this._checkApplied();
            this._commonWithNeighbors();
        }
        console.log(`${count} hints still open.`);
    }

    private _applyTrivialBlocks(): void {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                block.applyHint(false);
            }
        });
    }

    private _checkApplied(): void {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            block.checkApplied();
        });
    }

    private _generateBlockSolutions() {
        const iterator = new BlockIterator(this._grid);
        this._solutions = [];
        iterator.forEach(block => {
            if (!block.applied) {
                const solution = new BlockSolutions(block);
                solution.elliminateFromGrid(this._grid);
                this._solutions!.push(solution);
            }
        });
    }

    private _commonWithNeighbors(): void {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                const common = new CommonWithNeighbor(block);
                common.find();
            }
        });
    }

    private _countBlocks(): number {
        let count = 0;
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(_block => {
            count++;
        });
        return count;
    }

    private _countOpenBlocks(checkFirst: boolean = false): number {
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