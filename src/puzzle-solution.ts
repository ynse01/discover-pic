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
        for (let i = 0; i < numCols; i += PuzzleSolution._numBits) {
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

    public toString(): string {
        let result = "";
        const numRows = this._puzzle.rows.length;
        const numCols = this._puzzle.rows[0].length;
        for (let y = 0; y < numRows; y++) {
            for (let x = 0; x < numCols; x++) {
                const cell = new GridCell(x, y);
                const status = this.getStatus(cell);
                switch (status) {
                    case CellStatus.Unknown:
                        result += '!';
                        break;
                    case CellStatus.Empty:
                        result += ' ';
                        break;
                    case CellStatus.Full:
                        result += 'F';
                        break;
                }
            }
            result += '\n';
        }
        return result;
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
        const chr = block.charCodeAt(charIndex + 3);
        const powIndex = PuzzleSolution._numBits - bitIndex;
        const factor = Math.pow(2, powIndex);
        const mask = (chr - 32) % (factor * 2);
        return mask >= factor;
    }
}