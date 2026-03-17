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

        console.log("succes");
    }

}
