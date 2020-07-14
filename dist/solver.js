import { BlockIterator } from "./block-iterator.js";
import { CommonWithNeighbor } from "./common-with-neighbor.js";
import { BlockSolutions } from "./block-solutions.js";
export class Solver {
    constructor(grid) {
        this._grid = grid;
        this._solutions = undefined;
    }
    solve() {
        var _a;
        let previousCount = this._countBlocks() + 1;
        let count = previousCount - 1;
        while (count < previousCount) {
            this._applyTrivialBlocks();
            previousCount = count;
            count = this._countOpenBlocks();
        }
        if (count > 0) {
            console.log(`Trying harder...`);
            this._generateBlockSolutions();
            (_a = this._solutions) === null || _a === void 0 ? void 0 : _a.forEach(solution => {
                if (solution.count <= 1) {
                    console.log(`Block at position ${solution.block.cell} has ${solution.count} solutions left.`);
                }
            });
            this._checkApplied();
            this._commonWithNeighbors();
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
    _checkApplied() {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            block.checkApplied();
        });
    }
    _generateBlockSolutions() {
        const iterator = new BlockIterator(this._grid);
        this._solutions = [];
        iterator.forEach(block => {
            if (!block.applied) {
                const solution = new BlockSolutions(block);
                solution.elliminateFromGrid(this._grid);
                this._solutions.push(solution);
            }
        });
    }
    _commonWithNeighbors() {
        const iterator = new BlockIterator(this._grid);
        iterator.forEach(block => {
            if (!block.applied) {
                const common = new CommonWithNeighbor(block);
                common.find();
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