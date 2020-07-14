
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

    public isSame(other: GridCell): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public getFlatIndex(stride: number): number {
        return (this.y * stride) + this.x;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}