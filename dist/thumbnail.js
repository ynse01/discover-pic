import { GridCell } from "./grid-cell.js";
import { CellStatus } from "./grid.js";
import { PuzzleSolution } from "./puzzle-solution.js";
export class Thumbnail {
    constructor(puzzle) {
        this._puzzle = puzzle;
    }
    toDataURL() {
        this.ensureImage();
        return this._image;
    }
    ensureImage() {
        if (this._image === undefined) {
            const height = this._puzzle.rows.length;
            const width = this._puzzle.rows[0].length;
            const canvas = document.createElement("canvas");
            canvas.height = height;
            canvas.width = width;
            const context = canvas.getContext("2d");
            if (context !== null) {
                const imageData = context.createImageData(width, height);
                const solution = new PuzzleSolution(this._puzzle);
                let index = 0;
                for (let y = 0; y < imageData.height; y++) {
                    for (let x = 0; x < imageData.width; x++) {
                        const cell = new GridCell(x, y);
                        const status = solution.getStatus(cell);
                        if (status === CellStatus.Full) {
                            imageData.data[index] = 255;
                            imageData.data[index + 1] = 255;
                            imageData.data[index + 2] = 255;
                        }
                        index += 4;
                    }
                }
                context.putImageData(imageData, 0, 0);
                this._image = canvas.toDataURL("image/png");
            }
        }
    }
}
//# sourceMappingURL=thumbnail.js.map