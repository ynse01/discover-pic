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
        const charIndex = this._getCharIndex(cell);
        const bitIndex = this._getBitIndex(cell);
        const result = this._decodeCell(charIndex, bitIndex);
        return (result) ? CellStatus.Full : CellStatus.Empty;
    }

    public toggleStatus(cell: GridCell): void {
        if (this._puzzle.solution === undefined) {
            return;
        }
        const charIndex = this._getCharIndex(cell);
        const bitIndex = this._getBitIndex(cell);
        this._toggleBit(charIndex, bitIndex);
    }

    public test(charIndex: number, bitIndex: number): boolean {
        const original = this._decodeCell(charIndex, bitIndex);
        this._toggleBit(charIndex, bitIndex);
        const flipped = this._decodeCell(charIndex, bitIndex);
        if (original !== flipped) {
            this._toggleBit(charIndex, bitIndex);
            const back = this._decodeCell(charIndex, bitIndex);
            return (original === back);
        }
        return false;
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
        const end = Math.min(PuzzleSolution._numBits + start, statuses.length);
        for(let i = start; i < end; i++) {
            if (statuses[i]) {
                result += factor;
            }
            factor *= 2;
        }
        const code = String.fromCharCode(result + 32);
        return code;
    }

    private _decodeCell(charIndex: number, bitIndex: number): boolean {
        const block = this._puzzle.solution!;
        const chr = block.charCodeAt(charIndex + 3);
        const factor = Math.pow(2, bitIndex);
        const mask = (chr - 32) % (factor * 2);
        const isSet = mask >= factor;
        return isSet;
    }

    private _toggleBit(charIndex: number, bitIndex: number): void {
        let factor = (this._decodeCell(charIndex, bitIndex)) ? -1: 1;
        const powIndex = bitIndex;
        let mask = Math.pow(2, powIndex);
        const chr = this._puzzle.solution!.charCodeAt(charIndex + 3) + (mask * factor);
        this._puzzle.solution = this._replaceInString(this._puzzle.solution!, charIndex + 3, chr);
    }

    private _getCharIndex(cell: GridCell): number {
        const numCols = this._puzzle.rows[0].length;
        const stride = Math.ceil(numCols / PuzzleSolution._numBits);
        const offset = Math.floor(cell.x / PuzzleSolution._numBits);
        const charIndex = (stride * cell.y) + offset;
        return charIndex;
    }
    
    private _getBitIndex(cell: GridCell): number {
            return  cell.x % PuzzleSolution._numBits;
    }

    private _replaceInString(str: string, index: number, chr: number): string {
        return str.substr(0, index) + String.fromCharCode(chr) + str.substr(index + 1);
    }
}