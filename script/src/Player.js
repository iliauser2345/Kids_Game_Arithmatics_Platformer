// Classes

import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';

// Constants
import { PlayerStates,PlayerSize,PlayerAnimations } from './Constants.js';

export class Player extends Entity{
    //fields
    
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerStamina; //::int
    

    constructor(xas,yas){ //property state is a starting state when creating a player. it would change

        super({x:xas,y:yas,health:100});
        this.entityState=PlayerStates._IDLE;
        this.playerInventory=new Inventory(5);
        this.playerStamina=75;
        this.playerEquipment=null;

        this.gameFrame = 0;
        this.staggerFrames = 6;
        this.playerImage = new Image();
        this.playerImage.src = '../../assets/Knight_spritelist.png';
    }
    // methods
    
    /*
        What player must do:
            Update HP
            Update inventory
            Play Animations
                --Idle
                --Walk
                --Run
                --Attack 1, 2, 3, 4
                --Jump
                --Hurt
                --Die
     */
    CreateElement(){ // Deze mischien ook in Entity.js hebben zodat we polymorphism kunnen gebruiken
        this.playerCanvasElement = document.createElement('canvas');
        this.playerCanvasElement.id = 'player';
        this.playerCanvasElement.width = PlayerSize._WIDTH;
        this.playerCanvasElement.height = PlayerSize._HEIGHT;
        document.body.appendChild(this.playerCanvasElement);

        this.ctx = this.playerCanvasElement.getContext('2d'); // need this to draw
    }

    SetState(state){
        this.entityState = state;
    }
    Update(delta){
        // super.Update(delta);
        this.PlayPlayerAnimation(this.entityState);
        this.gameFrame++;
    }


    PlayPlayerAnimation(state){

        this.ctx.clearRect(0, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT);

        const animation = PlayerAnimations[state]; // e.g. PlayerAnimations["Idle"]
        const position = Math.floor(this.gameFrame / this.staggerFrames) % animation.loc.length;

        const frameX = animation.loc[position].x;
        const frameY = animation.loc[position].y;

        this.ctx.drawImage(
            this.playerImage,
            frameX, frameY,                          // crop from spritesheet
            PlayerSize._WIDTH, PlayerSize._HEIGHT,   // crop size
            0, 0,                                    // draw position on canvas
            PlayerSize._WIDTH, PlayerSize._HEIGHT    // draw size
        );

    }
    SetEquipment(item){

    }

}