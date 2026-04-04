import { ScreenSize } from './Constants.js';

export class World{

    
    constructor(){

        this.backgrImg="";
        this.tileImg="";
        this.enemy;

        // Layer contexts, wordt gebruikt in CreateLayers()
        this.backgroundCtx = null;
        this.worldCtx      = null;
        this.entityCtx     = null;
        this.hudCtx        = null;
    }

    // methods

    /*
     * De creation van de layers zier er een beetje zo uit:
     *   0 - background  (sky, far bg)      draw once
     *   1 - world       (tiles/map)        redraw on camera scroll
     *   2 - entities    (player/enemies)   clear & redraw every frame
     *   3 - hud         (UI/inventory)     redraw on state change
     */
    CreateLayers() {
        this.backgroundCtx = this.CreateLayer('background', 0);
        this.worldCtx      = this.CreateLayer('world',      1);
        this.entityCtx     = this.CreateLayer('entities',   2);
        this.hudCtx        = this.CreateLayer('hud',        3);
    }

    CreateLayer(id, zIndex) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        canvas.width  = ScreenSize._WIDTH;
        canvas.height = ScreenSize._HEIGHT;
        canvas.style.position = 'absolute';
        canvas.style.left     = '0';
        canvas.style.top      = '0';
        canvas.style.zIndex   = zIndex;
        document.body.appendChild(canvas);
        return canvas.getContext('2d');
    }

    GenerateWorld() {
        console.log("worldgenned");
    }

    // Call each frame before entities are drawn
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, ScreenSize._WIDTH, ScreenSize._HEIGHT);
    }
}