// Classes

import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';

// Constants
import { PlayerStates,PlayerSize } from './Constants.js';

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
    }


    PlayPlayerAnimation(state){

    }
    SetEquipment(item){

    }

}