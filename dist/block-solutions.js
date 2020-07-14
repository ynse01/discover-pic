import { CellStatus } from "./grid.js";
import { MicroIterator } from "./micro-iterator.js";
export class BlockSolutions {
    constructor(block) {
        this.block = block;
        this._solutions = BlockSolutions._generateSolutions(block.hint);
    }
    get count() {
        return this._solutions.length;
    }
    elliminateFromGrid(grid) {
        const iterator = new MicroIterator(this.block.cell);
        iterator.forEach((cell) => {
            const status = grid.getStatus(cell);
            if (status !== CellStatus.Unknown) {
                this._addConstraint(cell, status);
            }
        });
    }
    static _generateSolutions(hint) {
        let solutions = [];
        switch (hint) {
            case 0:
                solutions = BlockSolutions._solutions0;
                break;
            case 1:
                solutions = BlockSolutions._solutions1;
                break;
            case 2:
                solutions = BlockSolutions._solutions2;
                break;
            case 3:
                solutions = BlockSolutions._solutions3;
                break;
            case 4:
                solutions = BlockSolutions._solutions4;
                break;
            case 5:
                solutions = BlockSolutions._solutions5;
                break;
            case 6:
                solutions = BlockSolutions._solutions6;
                break;
            case 7:
                solutions = BlockSolutions._solutions7;
                break;
            case 8:
                solutions = BlockSolutions._solutions8;
                break;
            case 9:
                solutions = BlockSolutions._solutions9;
                break;
        }
        return solutions;
    }
    _addConstraint(cell, status) {
        if (status !== CellStatus.Unknown) {
            const bit = ((this.block.cell.y - cell.y) * 3) + (this.block.cell.x - cell.x);
            const isFilled = (status === CellStatus.Full) ? true : false;
            switch (bit) {
                case 0:
                    this._elliminateSolutions(solution => {
                        const rest0 = solution % 2;
                        if (isFilled)
                            return rest0 >= 1;
                        return rest0 < 1;
                    });
                    break;
                case 1:
                    this._elliminateSolutions(solution => {
                        const rest1 = (solution % 4);
                        if (isFilled)
                            return rest1 >= 2;
                        return rest1 < 2;
                    });
                    break;
                case 2:
                    this._elliminateSolutions(solution => {
                        const rest2 = (solution % 8);
                        if (isFilled)
                            return rest2 >= 4;
                        return rest2 < 4;
                    });
                    break;
                case 3:
                    this._elliminateSolutions(solution => {
                        const rest3 = (solution % 16);
                        if (isFilled)
                            return rest3 >= 8;
                        return rest3 < 8;
                    });
                    break;
                case 4:
                    this._elliminateSolutions(solution => {
                        const rest4 = (solution % 32);
                        if (isFilled)
                            return rest4 >= 16;
                        return rest4 < 16;
                    });
                    break;
                case 5:
                    this._elliminateSolutions(solution => {
                        const rest5 = (solution % 64);
                        if (isFilled)
                            return rest5 >= 32;
                        return rest5 < 32;
                    });
                    break;
                case 6:
                    this._elliminateSolutions(solution => {
                        const rest6 = (solution % 128);
                        if (isFilled)
                            return rest6 >= 64;
                        return rest6 < 64;
                    });
                    break;
                case 7:
                    this._elliminateSolutions(solution => {
                        const rest7 = (solution % 256);
                        if (isFilled)
                            return rest7 >= 128;
                        return rest7 < 128;
                    });
                    break;
                case 8:
                    this._elliminateSolutions(solution => {
                        const rest8 = (solution % 512);
                        if (isFilled)
                            return rest8 >= 256;
                        return rest8 < 256;
                    });
                    break;
                default:
                    // Shouldn't end up here.
                    break;
            }
        }
    }
    _elliminateSolutions(cb) {
        for (let i = this._solutions.length - 1; i >= 0; i--) {
            if (cb(this._solutions[i])) {
                this._solutions = this._solutions.splice(i);
            }
        }
    }
}
BlockSolutions._solutions0 = [0];
BlockSolutions._solutions1 = [1, 2, 4, 8, 16, 32, 128, 256];
BlockSolutions._solutions2 = [
    3, 5, 6, 9, 10, 12, 17, 18, 20, 24, 33, 34, 36, 40, 48, 65, 66, 68,
    72, 80, 96, 129, 130, 132, 136, 144, 160, 192, 257, 258, 260, 264,
    272, 288, 320, 384
];
BlockSolutions._solutions3 = [
    7, 11, 13, 14, 19, 21, 22, 25, 26, 28, 35, 37, 38, 41, 42, 44, 49,
    50, 52, 56, 67, 69, 70, 73, 74, 76, 81, 82, 84, 88, 97, 98, 100, 104,
    112, 131, 133, 134, 137, 138, 140, 145, 146, 148, 152, 161, 162, 164,
    168, 176, 193, 194, 196, 200, 208, 224, 259, 261, 262, 265, 266, 268,
    273, 274, 276, 280, 289, 290, 292, 296, 304, 321, 322, 324, 328, 336,
    352, 385, 386, 388, 392, 400, 416, 448
];
BlockSolutions._solutions4 = [
    15, 23, 27, 29, 30, 39, 43, 45, 46, 51, 53, 54, 57, 58, 60, 71, 75,
    77, 78, 83, 85, 86, 89, 90, 92, 99, 101, 102, 105, 106, 108, 113, 114,
    116, 120, 135, 139, 141, 142, 147, 149, 150, 153, 154, 156, 163, 165,
    166, 169, 170, 172, 177, 178, 180, 184, 195, 197, 198, 201, 202, 204,
    209, 210, 212, 216, 225, 226, 228, 232, 240, 263, 267, 269, 270, 275,
    277, 278, 281, 282, 284, 291, 293, 294, 297, 298, 300, 305, 306, 308,
    312, 323, 325, 326, 329, 330, 332, 337, 338, 340, 344, 353, 354, 356,
    360, 368, 387, 389, 390, 393, 394, 396, 401, 402, 404, 408, 417, 418,
    420, 424, 432, 449, 450, 452, 456, 464, 480
];
BlockSolutions._solutions5 = [
    31, 47, 55, 59, 61, 62, 79, 87, 91, 93, 94, 103, 107, 109, 110, 115,
    117, 118, 121, 122, 124, 143, 151, 155, 157, 158, 167, 171, 173, 174,
    179, 181, 182, 185, 186, 188, 199, 203, 205, 206, 211, 213, 214, 217,
    218, 220, 227, 229, 230, 233, 234, 236, 241, 242, 244, 248, 271, 279,
    283, 285, 286, 295, 299, 301, 302, 307, 309, 310, 313, 314, 316, 327,
    331, 333, 334, 339, 341, 342, 345, 346, 348, 355, 357, 358, 361, 362,
    364, 369, 370, 372, 376, 391, 395, 397, 398, 403, 405, 406, 409, 410,
    412, 419, 421, 422, 425, 426, 428, 433, 434, 436, 440, 451, 453, 454,
    457, 458, 460, 465, 466, 468, 472, 481, 482, 484, 488, 496
];
BlockSolutions._solutions6 = [
    63, 95, 111, 119, 123, 125, 126, 159, 175, 183, 187, 189, 190, 207,
    215, 219, 221, 222, 231, 235, 237, 238, 243, 245, 246, 249, 250, 252,
    287, 303, 311, 315, 317, 318, 335, 343, 347, 349, 350, 359, 363, 365,
    366, 371, 373, 374, 377, 378, 380, 399, 407, 411, 413, 414, 423, 427,
    429, 430, 435, 437, 438, 441, 442, 444, 455, 459, 461, 462, 467, 469,
    470, 473, 474, 476, 483, 485, 486, 489, 490, 492, 497, 498, 500, 504,
];
BlockSolutions._solutions7 = [
    127, 191, 223, 239, 247, 251, 253, 254, 319, 351, 367, 375, 379, 381,
    382, 415, 431, 439, 443, 445, 446, 463, 471, 475, 477, 478, 487, 491,
    493, 494, 499, 501, 502, 505, 506, 508,
];
BlockSolutions._solutions8 = [
    255, 383, 447, 479, 495, 503, 507, 509, 510
];
BlockSolutions._solutions9 = [511];
//# sourceMappingURL=block-solutions.js.map