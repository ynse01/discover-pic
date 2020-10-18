import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";
export class PuzzleSolution {
    constructor(puzzle) {
        this._puzzle = puzzle;
    }
    static encodeHeader(numRows, numCols) {
        var result = "";
        result += String.fromCharCode(1 + 32);
        result += String.fromCharCode(numRows + 32);
        result += String.fromCharCode(numCols + 32);
        return result;
    }
    static encodeRow(statuses) {
        var result = "";
        const numCols = statuses.length;
        for (let i = 0; i < numCols; i += PuzzleSolution._numBits) {
            result += PuzzleSolution._encodeBlock(statuses, i);
        }
        return result;
    }
    getStatus(cell) {
        if (this._puzzle.solution === undefined) {
            return CellStatus.Unknown;
        }
        const charIndex = this._getCharIndex(cell);
        const bitIndex = this._getBitIndex(cell);
        const result = this._decodeCell(charIndex, bitIndex);
        return (result) ? CellStatus.Full : CellStatus.Empty;
    }
    toggleStatus(cell) {
        if (this._puzzle.solution === undefined) {
            return;
        }
        const charIndex = this._getCharIndex(cell);
        const bitIndex = this._getBitIndex(cell);
        this._toggleBit(charIndex, bitIndex);
    }
    test(charIndex, bitIndex) {
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
    toString() {
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
    static _encodeBlock(statuses, start) {
        let result = 0;
        let factor = 1;
        const end = Math.min(PuzzleSolution._numBits + start, statuses.length);
        for (let i = start; i < end; i++) {
            if (statuses[i]) {
                result += factor;
            }
            factor *= 2;
        }
        const code = String.fromCharCode(result + 32);
        return code;
    }
    _decodeCell(charIndex, bitIndex) {
        const block = this._puzzle.solution;
        const chr = block.charCodeAt(charIndex + 3);
        const factor = Math.pow(2, bitIndex);
        const mask = (chr - 32) % (factor * 2);
        const isSet = mask >= factor;
        return isSet;
    }
    _toggleBit(charIndex, bitIndex) {
        let factor = (this._decodeCell(charIndex, bitIndex)) ? -1 : 1;
        const powIndex = bitIndex;
        let mask = Math.pow(2, powIndex);
        const chr = this._puzzle.solution.charCodeAt(charIndex + 3) + (mask * factor);
        this._puzzle.solution = this._replaceInString(this._puzzle.solution, charIndex + 3, chr);
    }
    _getCharIndex(cell) {
        const numCols = this._puzzle.rows[0].length;
        const stride = Math.ceil(numCols / PuzzleSolution._numBits);
        const offset = Math.floor(cell.x / PuzzleSolution._numBits);
        const charIndex = (stride * cell.y) + offset;
        return charIndex;
    }
    _getBitIndex(cell) {
        return cell.x % PuzzleSolution._numBits;
    }
    _replaceInString(str, index, chr) {
        return str.substr(0, index) + String.fromCharCode(chr) + str.substr(index + 1);
    }
}
PuzzleSolution._numBits = 6;
//# sourceMappingURL=puzzle-solution.js.map