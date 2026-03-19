import { Entity } from './Entity.js';
export class Enemy extends Entity{
    //fields
    enemyEquipment;
    enemyName;
    enemyType;

    constructor(health,name,type,EnemyEq){
        super(x,y,health);
        this.enemyEquipment=null;
        this.enemyName=name;
        this.enemyType=type;
        this.SetEquipment(EnemyEq)
    }
    // methods
    PlayAnimation(state,name){

    }
    SetEquipment(item){

    }

}