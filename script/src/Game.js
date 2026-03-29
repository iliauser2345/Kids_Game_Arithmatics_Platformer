import { Parser } from './Parser.js';
import { World } from './World.js';
import { Window } from './Window.js';
import { Entity } from './Entity.js';
import { Enemy } from './Enemy.js';
import { Player } from './Player.js';

export class Game{

    constructor(){
        this.parser= new Parser();
        this.world= new World();
        this.player= new Player();
        this.window=new Window();
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
        
        // Main loop concept
        let lastTime = 0;

        const loop = (timestamp) => {
            const delta = (timestamp - lastTime) / 1000; // Delta, het is het verschil tussen frames, en dit zorgt ervoor dat mensen op 120Hz niet een spel hebben wat 2x zo snel is.
            lastTime = timestamp;

            // this.player.Update(delta); // We geven delta mee als argument zodat we alles in seconden kunnen runnen, het maakt dus niert uit wat voor Hz/fps onze gebruikers hebben.
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        console.log("succes");
    }

    Debug(){
        // Deze method maakt de instances zoals this.player en this.world zichtbaar in de browser inspector console voor debugging.

        window.player = this.player;
        window.world = this.world;
    }

}
