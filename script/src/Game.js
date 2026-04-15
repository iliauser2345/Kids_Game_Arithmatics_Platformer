import { Parser } from './Parser.js';
import { World } from './World.js';
import { Window } from './Window.js';
import { Entity } from './Entity.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';
import { PlayerStates,PlayerAnimations,PlayerSize, ScreenSize, WorldConstants, SCRDIMENSIONS } from './Constants.js';

export class Game{

    constructor(){
        this.parser = new Parser();
        this.world = new World();
        this.player = null;
        this.window = new Window();
        this.loopId = null;
        this.lastTime = 0;
    }
    // methods

    //test
        //Play
            //1.load map
             //   1.1 spawn in player
             //   1.2 spawn in entities/chests/enemies
           // 2. Load start menu
            //3. Once started activate player, enemies, entities, animations
           // 4. Let player play
            //    4.1 while traversing camera should be locked to the center unless map stops there.
            //    4.2 dynamically load in map parts beyond visible screen once reached


    Play() {
        // Maak de layers
        this.world.CreateLayers();

        // Hier maken we de player, en we geven de ctx door zodat player zichzelf kan tekenen
        this.player = new Player({
            xas: 0,
            yas: WorldConstants._GROUND,
            ctx: this.world.entityCtx
        });

        // Doet nog niet echt iets
        this.world.GenerateWorld();

        // Useless
        this.window.LoadWindow("start");

        this.loopId = requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp){
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = (timestamp - this.lastTime);
        this.lastTime = timestamp;

        this.world.ClearEntityLayer();

        this.player.Update(delta, this.parser.getKeysArray());
        
        
        //DEMO STUFFFF
        
        this.player.DrawTileViewBox(this.world.entityCtx);
       // console.log(this.player.PlayerSearchForTiles(this.world.matrix));
        this.player.PlayerSearchForTiles(this.world.matrix).forEach(t => {
            this.player.ctx.fillStyle = "rgba(115, 255, 0, 0.4)";
            this.player.ctx.fillRect(
                t.engaged.entityPositionX,
                t.engaged.entityPositionY,
                SCRDIMENSIONS._TILEWIDTH,
                SCRDIMENSIONS._TILEHEIGHT
            );
        });
       // this.player.DrawHitBox(this.player.ctx, PlayerSize._WIDTH,PlayerSize._HEIGHT);
        this.player.DrawHitBox(this.world.entityCtx, 120,80);




        // this.world.Update() — future: scroll/update tile layer

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
        // Deze method maakt de instances zoals this.player en this.world zichtbaar in de browser inspector console voor debugging.

        window.player = this.player;
        window.world = this.world;
        window.game = this;
        window.PlayerStates = PlayerStates;
        window.PlayerAnimations = PlayerAnimations;
        window.PlayerSize = PlayerSize;
        window.ScreenSize = ScreenSize;
    }

}
