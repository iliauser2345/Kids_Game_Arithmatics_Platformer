// Classes
import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';

// Constants
import { PlayerStates, PlayerSize, PlayerAnimations, KEYS, ScreenSize, PlayerPhysics, Images, WorldConstants } from './Constants.js';
import { Tile } from './Tile.js';

export class Player extends Entity{
    //fields
    
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerStamina; //::int
    #TileViewField=10; //::amount of tiles
    #JumpOnce;
    #JumpCount;
    #JumpReleased;

    constructor({ xas, yas, ctx }) {
        super({x:xas,y:yas,health:100});
        this.entityState=PlayerStates._IDLE;
        this.playerInventory=new Inventory(5);
        this.playerStamina=75;
        this.playerEquipment=null;

        this.ctx = ctx;

        this.animationLocked = false;
        this.gameFrame = 0;
        this.animationTimer = 0;
        this.animationInterval = 50; // ms per frame
        this.COM = this.SetUpCOM(PlayerSize._WIDTH, PlayerSize._HEIGHT)

        this.direction = 1; // 1 = right, -1 = left
        this.onGround = this.entityPositionY >= WorldConstants._GROUND

        this.actionAllowed = true;
        this.actionDirection = null;
        this.dashAllowed = true;
        this.dashing = false;
        this.dashTime = PlayerPhysics._DASHTIME; // ms

        this.dodging = false;

        this.attacking = false;
        this.attackSequence = 0;

        this.#JumpOnce = false;
        this.#JumpCount = 0;
        this.#JumpReleased = true;
    }
    // methods

    Update(delta, keysDown) {
        this.COM = this.SetUpCOM(PlayerSize._WIDTH, PlayerSize._HEIGHT)
        this.HandleInput(delta, keysDown);
        this.Move(delta);
        this.HandleAnimation();
        this.PlayPlayerAnimation(this.entityState, delta, this.direction, this.actionDirection);
    }

    HandleInput(delta, keysDown){
        this.actionAllowed = !this.animationLocked && !this.dashing && !this.dodging;
        this.HandleX(delta, keysDown);
        this.HandleY(delta, keysDown);
        this.HandleATK(delta, keysDown);
    }

    HandleX(delta, keysDown){
        if (this.onGround){
            this.dashAllowed = true;
        }

        const velocity = PlayerPhysics._BASE_SPEED;

        const pressedRight = !!keysDown[KEYS._RWD];
        const pressedLeft  = !!keysDown[KEYS._LWD];
        const pressedDash  = !!keysDown[KEYS._AUX];
        const pressedDodge = !!keysDown[KEYS._DGE];
        
        if ((pressedRight && pressedLeft) || (!pressedRight && !pressedLeft)) {
            if (this.onGround){
                this.SetVelocity({ x: 0 });
            } else {this.SetVelocity({ x:Math.floor((this.entityVelocityX * 0.95)*1000)/1000})} // Basically airfriction :P
        } else if (pressedRight) {
            this.SetVelocity({ x: velocity });
            this.direction = 1;
        } else if (pressedLeft) {
            this.SetVelocity({ x: -velocity });
            this.direction = -1;
        }
        if (pressedDodge && !pressedDash && this.actionAllowed && this.onGround) {
            this.actionDirection = this.direction;
            this.dodging = true;
            this.SetVelocity({x:PlayerPhysics._BASE_SPEED*this.actionDirection});
        } else if (this.dodging) {
            this.SetVelocity({x: PlayerPhysics._BASE_SPEED * this.actionDirection});
            if (this.gameFrame >= 12) {
                if (pressedDodge && this.actionAllowed) {
                    this.actionDirection = this.direction;
                    this.dodging = true;
                    this.gameFrame = 0;
                    this.animationTimer = 0;
                } else {
                    this.dodging = false;
                    this.actionDirection = null;
                }
            }
        }

        if (pressedDash && !pressedDodge && this.dashAllowed && this.actionAllowed) {
            this.actionDirection = this.direction;
            this.dashAllowed = false;
            this.dashing = true;
            this.dashTime = PlayerPhysics._DASHTIME;
            this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });

        } else if (this.dashing) {
            this.dashTime -= delta;
            this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });

            if (this.dashTime <= 100) {
                if (pressedDash && !this.animationLocked && !this.dodging && !pressedDodge && this.dashAllowed) {
                    this.dashAllowed = false;
                    this.actionDirection = this.direction;
                    this.dashing = true;
                    this.dashTime = PlayerPhysics._DASHTIME;
                    this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });
                } else {
                    this.dashing = false;
                    this.dashTime = PlayerPhysics._DASHTIME;
                    this.actionDirection = null;
                }
            }
        }
    }

    HandleY(delta, keysDown){
        this.onGround = this.entityPositionY >= WorldConstants._GROUND;
        
        if (this.onGround) {
            this.#JumpCount = 0;
            if (this.entityVelocityY > 0) {
                this.SetVelocity({ y: 0 });
                this.entityPositionY = WorldConstants._GROUND;
            }
        }

        if (this.dashing) {
            this.SetVelocity({y: 0});
            return;
        }

        const jumpKeyPressed = !!keysDown[KEYS._JMP];

        if (jumpKeyPressed && this.#JumpReleased && this.#JumpCount < 2 && !this.dodging) {
            this.SetVelocity({ y: PlayerPhysics._JUMP_FORCE });
            this.#JumpCount++;
            this.#JumpReleased = false;
            this.#JumpOnce = true;
            this.onGround = false;
        } 
        
        if (!jumpKeyPressed) {
            this.#JumpReleased = true;
        }

        if (!this.onGround) {
            this.SetVelocity({ y: this.entityVelocityY + PlayerPhysics._GRAVITY * delta });
        } else if (!jumpKeyPressed) {
            this.SetVelocity({ y: 0 });
            this.entityPositionY = WorldConstants._GROUND;
        }
    }

    HandleATK(delta, keysDown){

        this.pressedAttack = !!keysDown[KEYS._ATK];
        this.pressedParry  = !!keysDown[KEYS._PRY];
    }

    HandleAnimation(){
        const airbourne = !this.onGround;

        if (this.attacking){
        }

        if (this.dodging){
            this.SetState(PlayerStates._ROLL);
            return;
        }

        if (this.dashing) {
            this.SetState(PlayerStates._DASH);
            return;
        }

        if (!airbourne) {
            if (this.entityVelocityX === 0) this.SetState(PlayerStates._IDLE);
            else this.SetState(PlayerStates._WALK);
        } else {
            if (this.entityVelocityY < 0 && this.#JumpOnce) {
                this.SetState(PlayerStates._JUMP);
            } else {
                this.SetState(PlayerStates._FALL);
                this.#JumpOnce = false;
            }
        }
    }

    SetState(state, once = false) {
        if (this.animationLocked) return;

        if (state && state !== this.entityState) {
            this.entityState = state;
            this.gameFrame = 0;
            this.animationTimer = 0;
            this.animationLocked = once;
        }
    }

    PlayPlayerAnimation(state, delta, direction, actionDirection) {
        this.animationTimer += delta;
        if (this.animationTimer >= this.animationInterval) {
            this.gameFrame++;
            this.animationTimer = 0;
        }

        if (actionDirection !== null){ direction = actionDirection}

        const animation = PlayerAnimations[state];

        if (this.animationLocked && this.gameFrame >= animation.loc.length) {
            this.animationLocked = false;
            this.SetState(PlayerStates._IDLE);
            return;
        }

        const position = this.animationLocked
            ? Math.min(this.gameFrame, animation.loc.length - 1)
            : this.gameFrame % animation.loc.length;

        const frameX = animation.loc[position].x;
        const frameY = animation.loc[position].y;
        
        this.ctx.save();

        if (direction === -1) {
            this.ctx.translate(this.entityPositionX + PlayerSize._WIDTH, this.entityPositionY);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                animation.image,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                0, 0,
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        } else {
            this.ctx.drawImage(
                animation.image,
                frameX, frameY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT,
                this.entityPositionX, this.entityPositionY,
                PlayerSize._WIDTH, PlayerSize._HEIGHT
            );
        }

        this.ctx.restore();
    }

    PlayerSearchForTiles(matrix,
        min=[
            this.COM[0]-PlayerSize._WIDTH*this.#TileViewField,
            this.COM[1]+PlayerSize._HEIGHT*this.#TileViewField],
        max=[
            this.COM[0]+PlayerSize._WIDTH*this.#TileViewField,
            this.COM[1]-PlayerSize._HEIGHT*this.#TileViewField]
        )
    {
        const results=[];
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
            const engaged = matrix[row][col];
            if(engaged.entityCenterOfMass){
                const valueX = matrix[row][col].entityCenterOfMass[0];
                const valueY = matrix[row][col].entityCenterOfMass[1];
                if (
                        valueX >= min[0] &&
                        valueY <= min[1] &&
                        valueX <= max[0] &&
                        valueY >= max[1]
                    ) 
                    {
                    results.push({ engaged, valueX, valueY, row, col });
                    }
                }
            }
        }

        return results;
}
    DrawTileViewBox(ctx) {
        const halfW = WorldConstants._BLOCKSIZEX * this.#TileViewField;
        const halfH = WorldConstants._BLOCKSIZEY * this.#TileViewField;

        const x = this.COM[0] - boxWidth / 2;
        const y = this.COM[1] - boxHeight / 2;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, halfW * 2, halfH * 2);
        ctx.restore();
    }
}   
