import { SCRDIMENSIONS } from './Constants.js';

export class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }

    /**
     * Centers the camera on an entity.
     * @param {Entity} entity       - The entity to follow (typically the player)
     * @param {number} entityWidth  - Width of the entity sprite
     * @param {number} entityHeight - Height of the entity sprite
     * @param {number} [worldWidth]  - Optional: clamp camera so it never shows outside world (pixels)
     * @param {number} [worldHeight] - Optional: clamp camera so it never shows outside world (pixels)
     */
    Follow(entity, entityWidth, entityHeight, worldWidth = Infinity, worldHeight = Infinity) {
        // Center the viewport on the entity's center of mass
        this.x = entity.entityPositionX + entityWidth  / 2 - SCRDIMENSIONS._SCRWIDTH  / 2;
        this.y = entity.entityPositionY + entityHeight / 2 - SCRDIMENSIONS._SCRHEIGHT / 2;

        // Clamp so the camera never goes past the world edges
        this.x = Math.max(0, Math.min(this.x, worldWidth  - SCRDIMENSIONS._SCRWIDTH));
        this.y = Math.max(0, Math.min(this.y, worldHeight - SCRDIMENSIONS._SCRHEIGHT));
    }

    /**
     * Applies the camera offset to a canvas context.
     * Call ctx.save() before and ctx.restore() after your draw calls.
     * @param {CanvasRenderingContext2D} ctx
     */
    Apply(ctx) {
        ctx.translate(-Math.floor(this.x), -Math.floor(this.y));
    }
}