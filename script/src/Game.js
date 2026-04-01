import { Parser } from './Parser.js';
import { World } from './World.js';
import { Window } from './Window.js';
import { Entity } from './Entity.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';
import { PlayerStates,PlayerAnimations,PlayerSize, ScreenSize } from './Constants.js';

export class Game{

    constructor(){
        this.parser = new Parser();
        this.world = new World();
        this.player = new Player({yas:ScreenSize._HEIGHT-PlayerSize._HEIGHT});
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


    Play(){
        this.world.GenerateWorld();
        this.window.LoadWindow("start");
        this.player.CreateElement();

        this.loopId = requestAnimationFrame(this.loop.bind(this)); // .bind(this) is voor een bugfix, een arrowfunction kan ook als fix dienen.
    }
    
    loop(timestamp){
        if (!this.lastTime) this.lastTime = timestamp;
        const delta = (timestamp - this.lastTime);
        this.lastTime = timestamp;

        // vv Hieronder komen de update methods vv
        this.player.Update(delta, this.parser.getKeysArray());
        // this.world.Update()


        this.loopId = requestAnimationFrame(this.loop.bind(this)); // hier ook .bind
    }


    Pause(){
        cancelAnimationFrame(this.loopId); // pauseert de loop
    }

    Resume(){
        this.lastTime = 0;
        this.loopId = requestAnimationFrame(this.loop.bind(this)); //en hier
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
