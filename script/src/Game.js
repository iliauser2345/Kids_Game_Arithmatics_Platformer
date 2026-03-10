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
    Play(){
        this.world.GenerateWorld();
        this.window.LoadWindow("start");

        console.log("succes");
    }

}
