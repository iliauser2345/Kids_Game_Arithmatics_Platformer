import { Entity } from './Entity.js';
export class Enemy extends Entity{
    //fields
    enemyEquipment;
    enemyName;
    enemyType;

    constructor(x,y,health,name,type,EnemyEq){
        super({x:x, y:y, health: health});
        this.enemyEquipment=null;
        this.enemyName=name;
        this.enemyType=type;
        this.SetEquipment(EnemyEq)
    }
    // methods
    PlayEnemyAnimation(state,name){

    }
    SetEquipment(item){

    }

}