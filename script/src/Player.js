import { KEYS } from './constants.js';
import { PlayerStates } from './constants.js';
import { Inventory } from './Inventory.js';
export class Player{
    //fields
    
    playerState; //::string
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerVelocityX;
    playerVelocitY;
    playerHealth; //::int
    playerStamina; //::int
    

    constructor(state){ //property state is a starting state when creating a player. it would change

        this.playerState=state;
        this.playerInventory=new Inventory(5);
        this.playerHealth=100;
        this.playerStamina=75;

    }
    // methods
    
    /*
        What player must do:
            Get/Loose HP
            methods for animations 
     */

}