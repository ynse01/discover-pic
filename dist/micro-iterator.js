export class MicroIterator {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    forEach(cb) {
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                cb(this.x + x, this.y + y);
            }
        }
    }
}
//# sourceMappingURL=micro-iterator.js.map