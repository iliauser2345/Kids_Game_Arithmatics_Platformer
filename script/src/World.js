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
        canvas.width  = ScreenSize._WIDTH;
        canvas.height = ScreenSize._HEIGHT;
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
        for (let y = 0; y < SCRDIMENSIONS._SCRHEIGHT/SCRDIMENSIONS._TILEHEIGHT; y++) {
            let row = [];
            for (let x = 0; x < SCRDIMENSIONS._SCRWIDTH/SCRDIMENSIONS._TILEWIDTH; x++) {
                row.push([0,[SCRDIMENSIONS._SCRWIDTH-(SCRDIMENSIONS._TILEWIDTH*x), SCRDIMENSIONS._SCRHEIGHT-(SCRDIMENSIONS._TILEHEIGHT*y)]]);
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
                    row[xindex + j][0] = 1;
                }
            }
        }
        matrix.forEach(row => console.log(row.join(' ')));
    }

    GenerateWorld() {
        let matrix=this.SetUpGrid();
        this.TilePositioning(matrix,4,5,4,4);
        this.backgrImg.onload = () => {
            this.backgroundCtx.drawImage(this.backgrImg, 0, 0, ScreenSize._WIDTH, ScreenSize._HEIGHT);
        };
        this.backgrImg.src = "./assets/PLACEHOLDER_bgr_image.jpg";

        // Build tile grid
        this.tiles = [];
        const cols = Math.ceil(ScreenSize._WIDTH  / WorldConstants._BLOCKSIZEX);
        const rows = Math.ceil(ScreenSize._HEIGHT / WorldConstants._BLOCKSIZEY);
        const groundRow = rows - 1; // bottom row = ground

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (row === groundRow) {
                    this.tiles.push(new Tile({
                        xas: Math.floor(col * WorldConstants._BLOCKSIZEX),
                        yas: Math.floor(row * WorldConstants._BLOCKSIZEY),  
                        tileType: "grassTM"
                    }));
                }
            }
        }

        // Draw tiles once (worldCtx is static until camera scrolls)
        Images._ENVIRONMENT.onload = () => this.DrawTiles();
        // If already loaded (cached), draw immediately
        if (Images._ENVIRONMENT.complete) this.DrawTiles();
    }

    DrawTiles() {
        for (const tile of this.tiles) {
            tile.Draw(this.worldCtx);
        }
    }

    // Call each frame before entities are drawn
    ClearEntityLayer() {
        this.entityCtx.clearRect(0, 0, ScreenSize._WIDTH, ScreenSize._HEIGHT);
    }
}