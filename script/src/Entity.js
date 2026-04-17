import { SCRDIMENSIONS, WorldConstants } from "./Constants.js";
export class Entity{

    //fields
    entityState;
    entityPositionX;
    entityPositionY;
    entityCenterOfMass;
    entityVelocityX;
    entityVelocityY;
    entityHealth;
    entityHitBox;
    elementSizeX;
    elementSizeY;
    ctx;


    constructor({x=0,y=0,health=null}={}){ // Changed to be able to access default values
        this.entityState="idle";
        this.entityPositionX=x;
        this.entityPositionY=y;
        this.entityVelocityX=0;
        this.entityVelocityY=0;
        this.entityHealth=health;

    }
    // methods
    InitRenderer({ctx, elementSizeX = WorldConstants._BLOCKSIZEX, elementSizeY = WorldConstants._BLOCKSIZEY}){
        this.ctx = ctx;
        this.elementSizeX = elementSizeX;
        this.elementSizeY = elementSizeY;
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
        this.entityHealth+=value;
    }
    LogStat(){
        console.log("state: ",this.entityState);
        console.log("Health: ",this.entityHealth);
        console.log("PosX: ",this.entityPositionX);
        console.log("PosY: ",this.entityPositionY);
        console.log("VelX: ",this.entityVelocityX);
        console.log("VelY: ",this.entityVelocityY);
    }

    SetUpCOM(sizeX, sizeY){
        const centerOfMass = [this.entityPositionX + sizeX / 2, this.entityPositionY + sizeY / 2];
        return centerOfMass;
    }

    SetUpHitBox(sizeX=32, sizeY=32){
        const minX = this.entityPositionX;
        const maxX = this.entityPositionX + sizeX;
        const minY = this.entityPositionY;
        const maxY = this.entityPositionY + sizeY;

        this.entityHitBox = { minX, maxX, minY, maxY };
        return this.entityHitBox;
    }

    DrawHitBox(ctx,sizeX = 32, sizeY = 32) {
        const hitbox = this.SetUpHitBox(sizeX, sizeY);
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.minX, hitbox.minY, sizeX, sizeY);
        ctx.restore();
    }

}
