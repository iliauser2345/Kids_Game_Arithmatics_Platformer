import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';
export class Player extends Entity{
    //fields
    
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerStamina; //::int
    

    constructor(){ //property state is a starting state when creating a player. it would change

        super(x,y,100);
        this.playerState=this.entityState;
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
                -Idle
                -Walk
                -Run
                -Jump
                -Fall
                -Interact
                -Attack
                -Hurt
                -Die
     */
    PlayAnimation(state){

    }
    SetEquipment(item){

    }

}