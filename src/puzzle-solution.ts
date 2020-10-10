import { IPuzzle } from "./i-puzzle.js";
import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";

export class PuzzleSolution {
    private static readonly _numBits = 6;
    private _puzzle: IPuzzle;

    public static encodeHeader(numRows: number, numCols: number): string {
        var result = "";
        result += String.fromCharCode(1 + 32);
        result += String.fromCharCode(numRows + 32);
        result += String.fromCharCode(numCols + 32);
        return result;
    }

    public static encodeRow(statuses: boolean[]): string {
        var result = "";
        const numCols = statuses.length;
        const end = Math.ceil(numCols / PuzzleSolution._numBits);
        for (let i = 0; i < end; i += PuzzleSolution._numBits) {
            result += PuzzleSolution._encodeBlock(statuses, i);
        }
        return result;
    }
    
    constructor(puzzle: IPuzzle) {
        this._puzzle = puzzle;
    }

    public getStatus(cell: GridCell): CellStatus {
        if (this._puzzle.solution === undefined) {
            return CellStatus.Unknown;
        }
        const numCols = this._puzzle.rows[0].length;
        const stride = Math.ceil(numCols / PuzzleSolution._numBits);
        const offset = Math.floor(cell.x / PuzzleSolution._numBits);
        const charIndex = (stride * cell.y) + offset;
        const bitIndex = cell.x % PuzzleSolution._numBits;
        const result = PuzzleSolution._decodeBlock(this._puzzle.solution, charIndex, bitIndex);
        return (result) ? CellStatus.Full : CellStatus.Empty;
    }

    private static _encodeBlock(statuses:boolean[], start: number): string {
        let result = 0;
        let factor = 1;
        const end = Math.min(PuzzleSolution._numBits, statuses.length - start);
        for(let i = 0; i < end; i++) {
            if (statuses[start + i]) {
                result += factor;
            }
            factor *= 2;
        }
        return String.fromCharCode(result + 32);
    }

    private static _decodeBlock(block: string, charIndex: number, bitIndex: number): boolean {
        const chr = block.charCodeAt(charIndex);
        const factor = Math.pow(2, bitIndex + 1);
        const mask = (chr - 32) % factor;
        return mask >= factor;
    }
}