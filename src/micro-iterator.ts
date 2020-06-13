
export class MicroIterator {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public forEach(cb: (x: number, y: number) => void): void {
        for (let y = -1; y <= 1; y++) {
            for(let x = -1; x <= 1; x++) {
                cb(this.x + x, this.y + y);
            }
        }        
    }

}