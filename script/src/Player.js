// Classes

import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';

// Constants
import { PlayerStates, PlayerSize, PlayerAnimations, KEYS, ScreenSize, PlayerPhysics } from './Constants.js';

export class Player extends Entity{
    //fields
    
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerStamina; //::int
    keysDown = {}; //::array
    

    constructor({xas,yas}){ //property state is a starting state when creating a player. it would change

        super({x:xas,y:yas,health:100});
        this.entityState=PlayerStates._IDLE;
        this.playerInventory=new Inventory(5);
        this.playerStamina=75;
        this.playerEquipment=null;

        this.gameFrame = 0;
        this.animationTimer = 0;
        this.animationInterval = 200; // ms per frame
        this.playerImage = new Image();
        this.playerImage.src = './assets/Knight_spritelist.png';
        this.direction = 1; // default facing right
        this.keysDown = {};
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
        this.playerCanvasElement.style.position = 'absolute'
        document.body.appendChild(this.playerCanvasElement);

        this.ctx = this.playerCanvasElement.getContext('2d'); // need this to draw
    }

    Update(delta, keysDown){
        this.HandleInput(delta, keysDown);
        this.Move(delta);            // ← Move once here, after both Handle calls

        
        this.PlayPlayerAnimation(this.entityState, delta, this.direction);
    }

    HandleInput(delta, keysDown){
        this.HandleX(delta, keysDown);
        this.HandleY(delta, keysDown);
    }

    HandleX(delta, keysDown){
        const velocity = keysDown[KEYS._AUX]
            ? PlayerPhysics._BASE_SPEED * PlayerPhysics._SPRINT_MULT
            : PlayerPhysics._BASE_SPEED;

        const pressedRight = !!keysDown[KEYS._RWD];
        const pressedLeft  = !!keysDown[KEYS._LWD];

        if ((pressedRight && pressedLeft) || (!pressedRight && !pressedLeft)) {
            this.SetVelocity({ x: 0 });
        } else if (pressedRight) {
            this.SetVelocity({ x: velocity });
            this.direction = 1;
        } else if (pressedLeft) {
            this.SetVelocity({ x: -velocity });
            this.direction = -1;
        }

        if      (this.entityVelocityX === 0)                                    this.SetState(PlayerStates._IDLE);
        else if (Math.abs(this.entityVelocityX) > PlayerPhysics._BASE_SPEED)    this.SetState(PlayerStates._RUN);
        else                                                                     this.SetState(PlayerStates._WALK);
    }

    HandleY(delta, keysDown){
        const ground = ScreenSize._HEIGHT - PlayerSize._HEIGHT;
        const onGround = this.entityPositionY >= ground;

        if (keysDown[KEYS._JMP] && onGround) {
            this.SetVelocity({ y: PlayerPhysics._JUMP_FORCE });
            this.SetState(PlayerStates._JUMP);
        } else if (!onGround) {
            this.SetVelocity({ y: this.entityVelocityY + PlayerPhysics._GRAVITY * delta });
        } else {
            this.SetVelocity({ y: 0 });
            this.entityPositionY = ground;
        }
    }

    SetState(state){
        if (state){
            this.entityState = state;
        }
    }

    PlayPlayerAnimation(state, delta, direction){

        this.animationTimer += delta; 
        if (this.animationTimer >= this.animationInterval){
            this.gameFrame++;
            this.animationTimer = 0;
        }

        this.playerCanvasElement.style.left = this.entityPositionX + 'px';
        this.playerCanvasElement.style.top = this.entityPositionY + 'px';
        this.ctx.clearRect(0, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT);

        const animation = PlayerAnimations[state];
        const position = Math.floor(this.gameFrame) % animation.loc.length;
        const frameX = animation.loc[position].x;
        const frameY = animation.loc[position].y;

        this.ctx.save();

        if (direction === -1){
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.playerImage,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                -PlayerSize._WIDTH, 0,                  // negative x to compensate for flip
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        } else {
            this.ctx.drawImage(
                this.playerImage,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                0, 0,
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        }

    this.ctx.restore();

    }
    SetEquipment(item){

    }

}