export class Entity{

    //fields
    entityState;
    entityPositionX;
    entityPositionY;
    entityVelocityX;
    entityVelocityY;
    entityHealth;


    constructor({x=0,y=0,health=null}={}){ // Changed to be able to access default values
        this.entityState="idle";
        this.entityPositionX=x;
        this.entityPositionY=y;
        this.entityVelocityX=0;
        this.entityVelocityY=0;
        this.entityHealth=health;

    }
    // methods
    CreateElement(){
        
    }
    SetState(state){
        this.entityState=state;
    }
    MoveTo(x,y){ // Uses coordinates to move
        this.entityPositionX=x;
        this.entityPositionY=y;        
    }
    Move(delta = 1){
        this.entityPositionX += this.entityVelocityX * delta;
        this.entityPositionY += this.entityVelocityY * delta;
    }
    SetVelocity({x = this.entityVelocityX, y = this.entityVelocityY}={}){ // Changed to be able to only change one axis at a time
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