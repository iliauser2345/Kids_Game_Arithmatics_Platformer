// Classes
import { Inventory } from './Inventory.js';
import { Entity } from './Entity.js';

// Constants
import { PlayerStates, PlayerSize, PlayerAnimations, KEYS, ScreenSize, PlayerPhysics, Images, WorldConstants } from './Constants.js';

export class Player extends Entity{
    //fields
    
    playerInventory; //::Inventory
    playerEquipment; //::Item
    playerStamina; //::int
    #JumpOnce;

    constructor({ xas, yas, ctx }) {
        super({x:xas,y:yas,health:100});
        this.entityState=PlayerStates._IDLE;
        this.playerInventory=new Inventory(5);
        this.playerStamina=75;
        this.playerEquipment=null;

        // Shared entity layer context passed in from World
        this.ctx = ctx;

        this.animationLocked = false;
        this.gameFrame = 0;
        this.animationTimer = 0;
        this.animationInterval = 50; // ms per frame

        this.direction = 1; // 1 = right, -1 = left
        this.onGround = this.entityPositionY >= WorldConstants._GROUND
        this.actionAllowed;
        this.dashAllowed = true;

        this.dashTime = 500;
    }
    // methods

    Update(delta, keysDown) {
        this.HandleInput(delta, keysDown);
        this.Move(delta);
        this.HandleAnimation();
        this.PlayPlayerAnimation(this.entityState, delta, this.direction, this.actionDirection);
       // console.log(this.entityPositionX+" "+this.entityPositionY);
    }

    HandleInput(delta, keysDown){
        this.actionAllowed = !this.animationLocked && !this.dashing && !this.dodging; // Wordt groter met tijd
        this.HandleX(delta, keysDown);
        this.HandleY(delta, keysDown);
    }

    HandleX(delta, keysDown){
        if (this.onGround){
            this.dashAllowed = true;
        }

        const velocity = /*keysDown[KEYS._AUX]*/ false
            ? PlayerPhysics._BASE_SPEED * PlayerPhysics._SPRINT_MULT
            : PlayerPhysics._BASE_SPEED;

        const pressedRight = !!keysDown[KEYS._RWD];
        const pressedLeft  = !!keysDown[KEYS._LWD];
        const pressedDash  = !!keysDown[KEYS._AUX];
        const pressedDodge = !!keysDown[KEYS._DGE];
        
        if ((pressedRight && pressedLeft) || (!pressedRight && !pressedLeft)) {
            this.SetVelocity({ x: 0 });
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
            if (this.gameFrame == 12) {
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
            this.dashTime = 500;
            this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });

        } else if (this.dashing) {

            this.dashTime -= delta;
            this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });

            if (this.dashTime <= 0) {
                if (pressedDash && !this.animationLocked && !this.dodging && !pressedDodge && this.dashAllowed) {
                    this.dashAllowed = false;
                    this.actionDirection = this.direction;
                    this.dashing = true;
                    this.dashTime = 500;
                    this.SetVelocity({ x: PlayerPhysics._BASE_SPEED * (this.dashTime / 100) * this.actionDirection });
                } else {
                    this.dashing = false;
                    this.dashTime = 500;
                    this.actionDirection = null;
                }
            }
        }
    }

    HandleY(delta, keysDown){
        this.onGround = this.entityPositionY >= WorldConstants._GROUND;
        if (this.dashing){this.SetVelocity({y:0});return}

        if (keysDown[KEYS._JMP] && this.onGround && !this.dodging) {
            this.SetVelocity({ y: PlayerPhysics._JUMP_FORCE });
            this.#JumpOnce = true;
        } else if (!this.onGround) {
            this.SetVelocity({ y: this.entityVelocityY + PlayerPhysics._GRAVITY * delta });
        } else {
            this.SetVelocity({ y: 0 });
            this.entityPositionY = WorldConstants._GROUND;
        }
    }

    HandleAnimation(){
        const airbourne = !this.onGround;

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
        if (this.animationLocked) return; // blokkeert de animation change totdat hij klaar is

        if (state && state !== this.entityState) {
            this.entityState = state;
            this.gameFrame = 0;        // start alle animaties op frame 0
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

        // One-shot animation has completed a full cycle
        if (this.animationLocked && this.gameFrame >= animation.loc.length) {
            this.animationLocked = false;
            this.SetState(PlayerStates._IDLE); // or whichever fallback state fits
            return;
        }

        // Loop for normal states, clamp for locked one-shot states
        const position = this.animationLocked
            ? Math.min(this.gameFrame, animation.loc.length - 1)
            : this.gameFrame % animation.loc.length;

        const frameX = animation.loc[position].x;
        const frameY = animation.loc[position].y;

        // Draw onto the shared entity canvas at the player's world position
        
        this.ctx.save();

        if (direction === -1) {
            // De horizontale flip
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
}