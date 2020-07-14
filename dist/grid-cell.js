export class GridCell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(x, y) {
        return new GridCell(this.x + x, this.y + y);
    }
    isSame(other) {
        return this.x === other.x && this.y === other.y;
    }
    getFlatIndex(stride) {
        return (this.y * stride) + this.x;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
//# sourceMappingURL=grid-cell.js.map