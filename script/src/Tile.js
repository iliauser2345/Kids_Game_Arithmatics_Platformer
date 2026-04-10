import { WorldConstants, Images, BlockLoc } from "./Constants.js";
import { Entity } from "./Entity.js";

const TileTypeMap = {
    0: null,
    1: "grassTM",
};

export class Tile extends Entity {
    #tileINDX;

    constructor({ xas = 0, yas = 0, tileINDX = 0 }) {
        super({ x: xas, y: yas, health: null });
        this.#tileINDX = tileINDX;
    }

    get tileINDX()        { return this.#tileINDX; }
    set tileINDX(val)     { this.#tileINDX = val;  }

    Draw(ctx) {
        const tileType = TileTypeMap[this.#tileINDX];
        if (!tileType) return;

        const { x, y } = BlockLoc[tileType];
        ctx.drawImage(
            Images._ENVIRONMENT,
            x, y,
            WorldConstants._BLOCKSIZEX,
            WorldConstants._BLOCKSIZEY,
            Math.floor(this.entityPositionX),
            Math.floor(this.entityPositionY),
            WorldConstants._BLOCKSIZEX + 1,  // ← 1px overdraw
            WorldConstants._BLOCKSIZEY + 1
        );
    }
}