import { CellStatus } from "./grid.js";
import { Block } from "./block.js";
import { IGame } from "./i-game.js";

export class GridView {
    private _svg: SVGElement;
    private _game: IGame;
    private _onCellClickHandler: (x: number, y: number) => void;

    public static readonly svgNS = 'http://www.w3.org/2000/svg';
    private static readonly fontSizeFactor = 0.75;
    private static readonly fontBaselineFactor = 0.77;

    constructor(svg: SVGElement, game: IGame, cellClickHandler: (x: number, y: number) => void) {
        this._svg = svg;
        this._game = game;
        this._onCellClickHandler = cellClickHandler;
        this.drawGrid();
        this._game.grid.registerChangeHandler(this._onCellChanged.bind(this));
    }

    private drawGrid(): void {
        const grid = this._game.grid;
        const left = grid.getXPos(0);
        const top = grid.getYPos(0);
        const right = grid.getXPos(grid.numCols);
        const bottom = grid.getYPos(grid.numRows);
        const border = this._drawRect(left, top, right - left, bottom - top);
        border.setAttribute("class", "border");
        for (let y = 0; y < grid.numRows; y++) {
            for (let x = 0; x < grid.numCols; x++) {
                this._drawCell(x, y);
                this._updateCell(x, y);
                const block = grid.getBlock(x, y);
                if (block !== undefined) {
                    this._updateBlock(block);
                }
            }
        }
    }

    private _updateCell(x: number, y: number) {
        const rect = document.getElementById(`cell-${x}-${y}`);
        const hint = document.getElementById(`hint-${x}-${y}`);
        const crossUp = document.getElementById(`crossup-${x}-${y}`);
        const crossDown = document.getElementById(`crossdown-${x}-${y}`);
        if (rect !== null && hint !== null && crossUp !== null && crossDown !== null) {
            const status = this._game.grid.getStatus(x, y);
            switch(status) {
                case CellStatus.Empty:
                    rect.setAttribute("class", "cellEmpty");
                    hint.setAttribute("class", "hintEmpty");
                    crossUp.setAttribute("class", "crossEmpty");
                    crossDown.setAttribute("class", "crossEmpty");
                    break;
                case CellStatus.Full:
                    rect.setAttribute("class", "cellFull");
                    hint.setAttribute("class", "hintFull");
                    crossUp.setAttribute("class", "crossFull");
                    crossDown.setAttribute("class", "crossFull");
                    break;
                case CellStatus.Unknown:
                default:
                    rect.setAttribute("class", "cellUnknown");
                    hint.setAttribute("class", "hintUnknown");
                    crossUp.setAttribute("class", "crossUnknown");
                    crossDown.setAttribute("class", "crossUnknown");
                    break;
            }
        }
    }

    private _updateBlock(block: Block): void {
        const hint = document.getElementById(`hint-${block.x}-${block.y}`);
        if (hint != null) {
            if (block.applied) {
                hint.classList.add("applied");
            } else {
                hint.classList.remove("applied");
            }
            if (block.error) {
                hint.classList.add("hintError");
            } else {
                hint.classList.remove("hintError");
            }
            if (block.hint >= 0) {
                hint.textContent = `${block.hint}`;
            } else {
                hint.textContent = " ";
            }
        }
    }

    private _drawCell(x: number, y: number): void {
        const grid = this._game.grid;
        const xPos = grid.getXPos(x);
        const yPos = grid.getYPos(y);
        const rect = this._drawRect(xPos, yPos, grid.cellSize, grid.cellSize);
        rect.setAttribute("id", `cell-${x}-${y}`);
        const cross = this._drawCross(xPos, yPos);
        cross[0].setAttribute("id", `crossdown-${x}-${y}`);
        cross[1].setAttribute("id", `crossup-${x}-${y}`);
        const text = this._drawHint(xPos, yPos);
        text.setAttribute("id", `hint-${x}-${y}`);
    }

    private _drawRect(xPos: number, yPos: number, width: number, height: number): SVGRectElement {
        const rect = document.createElementNS(GridView.svgNS, "rect");
        rect.setAttribute("x", `${xPos}`);
        rect.setAttribute("y", `${yPos}`);
        rect.setAttribute("width", `${width}`);
        rect.setAttribute("height", `${height}`);
        rect.setAttribute("class", "cellUnknown");
        rect.onclick = this._onMouseClick.bind(this);
        this._svg.appendChild(rect);
        return rect;
    }

    private _drawHint(xPos: number, yPos: number): SVGTextElement {
        const text = document.createElementNS(GridView.svgNS, "text");
        const grid = this._game.grid;
        text.setAttribute("x", `${xPos + (grid.cellSize / 2)}`);
        text.setAttribute("y", `${yPos + (grid.cellSize * GridView.fontBaselineFactor)}`);
        text.setAttribute("font-size", `${grid.cellSize * GridView.fontSizeFactor}`);
        text.setAttribute('text-anchor', "middle")
        text.setAttribute("class", "textUnknown");
        text.setAttribute("pointer-events", "none");
        const node = document.createTextNode(" ");
        text.appendChild(node);
        this._svg.appendChild(text);
        return text;
    }

    private _drawCross(xPos: number, yPos: number): SVGLineElement[] {
        const grid = this._game.grid;
        const down = document.createElementNS(GridView.svgNS, "line");
        down.setAttribute("x1", `${xPos + 2}`);
        down.setAttribute("y1", `${yPos + 2}`);
        down.setAttribute("x2", `${xPos + grid.cellSize - 2}`);
        down.setAttribute("y2", `${yPos + grid.cellSize - 2}`);
        down.setAttribute("class", "crossUnknown");
        down.setAttribute("pointer-events", "none");
        this._svg.appendChild(down);
        const up = document.createElementNS(GridView.svgNS, "line");
        up.setAttribute("x1", `${xPos + grid.cellSize - 2}`);
        up.setAttribute("y1", `${yPos + 2}`);
        up.setAttribute("x2", `${xPos + 2}`);
        up.setAttribute("y2", `${yPos + grid.cellSize - 2}`);
        up.setAttribute("class", "crossUnknown");
        up.setAttribute("pointer-events", "none");
        this._svg.appendChild(up);
        return [down, up];
    }

    private _onMouseClick(e: MouseEvent): any {
        const target = e.target as SVGRectElement;
        if (target !== null) {
            const parts = target.id.split("-");
            if (parts.length > 2 && parts[0] === "cell") {
                const x = parseInt(parts[1])
                const y = parseInt(parts[2]);
                if (!isNaN(x) && !isNaN(y)) {
                    this._onCellClickHandler(x, y);
                    this._game.restorePoint();
                }
            }
        }
    }

    private _onCellChanged(x: number, y: number): void {
        this._updateCell(x, y);
        const block = this._game.grid.getBlock(x, y);
        if (block !== undefined) {
            this._updateBlock(block);
        }
    }
}
