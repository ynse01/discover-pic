
export class GridCell {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(x: number, y: number): GridCell {
        return new GridCell(this.x + x, this.y + y);
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}