import { Entity } from './Entity.js';
import { Inventory } from './Inventory.js';

export class Chest extends Entity{

    //fields
    contents;// contents of a chest (inventory)


    constructor(){
        super({x:0,y:0,health:null})
        this.contents=new Inventory(10);
        


    }
    // methods

    PlayAnimation(state){

    }
    SetContents(item){

    }

}