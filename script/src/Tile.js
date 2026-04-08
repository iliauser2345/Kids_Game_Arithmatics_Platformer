import { WorldConstants, Images, BlockLoc } from "./Constants.js";
import { Entity } from "./Entity.js";

export class Tile extends Entity {
    #tileType;

    constructor({ xas = 0, yas = 0, tileType = "grassTM" }) {
        super({ x: xas, y: yas, health: null });
        this.#tileType = tileType;
    }

    Draw(ctx) {
        const { x, y } = BlockLoc[this.#tileType];
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