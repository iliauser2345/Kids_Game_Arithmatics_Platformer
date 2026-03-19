export class Entity{

    //fields
    entityState;
    entityPositionX;
    entityPositionY;
    entityVelocityX;
    entityVelocityY;
    entityHealth;


    constructor(x=0,y=0,health=null){
        this.entityState="idle";
        this.entityPositionX=x;
        this.entityPositionY=y;
        this.entityVelocityX=0;
        this.entityVelocityY=0;
        this.entityHealth=health;

    }
    // methods
    SetState(state){
        this.entityState=state;
    }
    Spawn(x,y){
        this.entityPositionX=x;
        this.entityPositionY=y;        
    }
    SetVelocity(x,y){
        this.entityVelocityX=x;
        this.entityVelocityY=y;
    }
    SetHP(value){
        this.entityHealth=value;
    }
    UpdateHP(value){
        this.entityHealth=+value;
    }
    LogStat(){
        console.log("state: ",this.entityState);
        console.log("Health: ",this.entityHealth);
        console.log("PosX: ",this.entityPositionX);
        console.log("PosY: ",this.entityPositionY);
        console.log("VelX: ",this.entityVelocityY);
        console.log("VelY: ",this.entityVelocityY);
    }
    

}