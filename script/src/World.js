import { ScreenSize, Images, WorldConstants, SCRDIMENSIONS } from './Constants.js';
import { Tile } from './Tile.js';

export class World{
    

    
    constructor(){

        this.WorldGrid = [];
        this.backgrImg = new Image();
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
        canvas.width  = SCRDIMENSIONS._SCRWIDTH;
        canvas.height = SCRDIMENSIONS._SCRHEIGHT;
        canvas.style.position = 'absolute';
        canvas.style.left     = '0';
        canvas.style.top      = '0';
        canvas.style.zIndex   = zIndex;
        canvas.style.imageRendering = 'pixelated';
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; 
        return ctx;
    }
    SetUpGrid(){
        let matrix=[];
        console.log(SCRDIMENSIONS._SCRWIDTH);
        console.log(SCRDIMENSIONS._SCRHEIGHT);
        for (let y = 0; y < WorldConstants._GRIDSIZEY; y++) {
            let row = [];
            let IsGround = 0;
            if (y == WorldConstants._GRIDSIZEY - 1){IsGround = 1}
            for (let x = 0; x < WorldConstants._GRIDSIZEX; x++) {
                row.push(new Tile({xas:SCRDIMENSIONS._TILEWIDTH*x, yas:SCRDIMENSIONS._TILEHEIGHT*y, tileINDX:IsGround}));
            }
            matrix.push(row);
        }
        //matrix.forEach(row => console.log(row.join(' ][ ')));   
        return matrix;
    }
    TilePositioning(matrix, factor, distance, amount, marge) {// matrix - grid; factor- how wide a gap would be; distance- distance between gaps; amount- amount of levels(platform) on a map; marge- distance between those platforms(in tiles)
        for (
            let yindex = matrix.length - 1 - marge, i = 0;
            i < amount && yindex >= 0;
            i++, yindex -= marge
        ) {
            let row = matrix[yindex];
            for (
                let xindex = 0;
                xindex < row.length - 3;
                xindex += distance + factor 
            ) {
                for (let j = 0; j < 4; j++) {
                    row[xindex + j].tileINDX = 2;
                }
            }
        }
        matrix.forEach(row => console.log(row.map(tile => tile.tileINDX).join(' ')));
        matrix.forEach(row => console.log(row.join(' ')));
    }
    
    GenerateWorld() {
        this.matrix=this.SetUpGrid();
        this.TilePositioning(

            this.matrix,
            4, // gap lenght
            5, // distance between gaps
            4, // amount of platforms (y axis)
            4 // distance between levels (y axis)
        );
        this.backgrImg.onload = () => {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, SCRDIMENSIONS._SCRWIDTH, SCRDIMENSIONS._SCRHEIGHT);
        };
        this.backgrImg.src = "./assets/Image.png";

        // Draw tiles once (worldCtx is static until camera scrolls)
        Images._ENVIRONMENT.onload = () => this.DrawTiles();
        // If already loaded (cached), draw immediately
        if (Images._ENVIRONMENT.complete) this.DrawTiles();
    }

    DrawTiles() {
        for (const row of this.matrix) {
            for (const tile of row) {
                tile.Draw(this.worldCtx);
            }
        }
    }

    // Call each frame before entities are drawn
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, SCRDIMENSIONS._SCRWIDTH, SCRDIMENSIONS._SCRHEIGHT);
    }
}