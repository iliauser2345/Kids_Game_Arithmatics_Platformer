import { Parser } from './Parser.js';
import { World } from './World.js';
import { Window } from './Window.js';
import { Camera } from './Camera.js';
import { Entity } from './Entity.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';
import { PlayerStates, PlayerAnimations, PlayerSize, ScreenSize, WorldConstants, SCRDIMENSIONS } from './Constants.js';

export class Game{

    constructor(){
        this.parser     = new Parser();
        this.world      = new World();
        this.camera     = new Camera();
        this.player     = null;
        this.gameWindow = new Window();
        this.loopId     = null;
        this.lastTime   = 0;
    }

    Play() {
        this.world.CreateLayers();

        this.player = new Player({
            xas: 0,
            yas: WorldConstants._GROUND,
            ctx: this.world.entityCtx
        });

        this.world.GenerateWorld();

        this.gameWindow.LoadWindow("start");

        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        // ── Camera ──────────────────────────────────────────────────────────
        // Center on the player; pass optional world pixel dimensions to clamp
        // the camera so it never shows blank space beyond the map edges.
        // If your world is larger than the screen, compute worldPixelWidth as:
        //   WorldConstants._GRIDSIZEX * SCRDIMENSIONS._TILEWIDTH
        const worldPixelWidth  = WorldConstants._GRIDSIZEX * SCRDIMENSIONS._TILEWIDTH;
        const worldPixelHeight = WorldConstants._GRIDSIZEY * SCRDIMENSIONS._TILEHEIGHT;
        this.camera.Follow(this.player, PlayerSize._WIDTH, PlayerSize._HEIGHT, worldPixelWidth, worldPixelHeight);

        // ── World layer ──────────────────────────────────────────────────────
        // Redraw tiles every frame offset by the camera
        this.world.RedrawTiles(this.camera.x, this.camera.y);

        // ── Entity layer ─────────────────────────────────────────────────────
        // Clear first (no transform), then apply camera before drawing
        this.world.ClearEntityLayer();
        const entityCtx = this.world.entityCtx;
        entityCtx.save();
        this.camera.Apply(entityCtx);                                         // shift ctx by -camera.x / -camera.y
        this.player.Update(delta, this.parser.getKeysArray(), this.world.matrix);
        entityCtx.restore();

        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    Pause(){
        cancelAnimationFrame(this.loopId);
    }

    Resume(){
        this.lastTime = 0;
        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    Debug(){
        window.player       = this.player;
        window.world        = this.world;
        window.camera       = this.camera;
        window.game         = this;
        window.PlayerStates = PlayerStates;
        window.PlayerAnimations = PlayerAnimations;
        window.PlayerSize   = PlayerSize;
        window.ScreenSize   = ScreenSize;
    }
}