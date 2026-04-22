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
    #TileViewField=3; //::amount of tiles
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
        this.devstuff = false;

        this.entityHitBox=this.SetUpHitBoxPlayer();
    }
    // methods

    Update(delta, keysDown, matrix) {
        this.HandleInput(delta, keysDown);
        this.Move(delta);
        // Recalculate COM and hitbox AFTER moving so collision sees the new position
        this.COM = this.SetUpCOM(PlayerSize._WIDTH, PlayerSize._HEIGHT+80)
        this.entityHitBox = this.SetUpHitBoxPlayer();
        this.PlayerCollisionDetectionHandler(this.PlayerSearchForTiles(matrix), matrix);
        this.HandleAnimation();
        this.PlayPlayerAnimation(this.entityState, delta, this.direction, this.actionDirection);
        this.Developer(this.ctx, this.devstuff, matrix);
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

    HandleY(delta, keysDown) {
        if (this.dashing) {
            this.SetVelocity({ y: 0 });
            return;
        }

        const jumpKeyPressed = !!keysDown[KEYS._JMP];

        if (this.onGround) {
            this.#JumpCount = 0;
            this.SetVelocity({ y: 0.1 }); // tiny push so player stays overlapping tile each frame
        } else {
            this.SetVelocity({ y: this.entityVelocityY + PlayerPhysics._GRAVITY * delta });
        }

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
    SetUpHitBoxPlayer(sizeX = 20, sizeY = 38) {
        const offsetX = (120 - sizeX) / 2;  // center hitbox horizontally in 120px frame
        const offsetY = 80 - sizeY;          // align hitbox to bottom of 80px frame

        const minX = this.entityPositionX + offsetX;
        const maxX = minX + sizeX;
        const minY = this.entityPositionY + offsetY;
        const maxY = minY + sizeY;

        return { minX, maxX, minY, maxY };
    }
     DrawHitBoxPlayer(ctx, sizeX = 20, sizeY = 38) {
        // White — collision hitbox
        const hitbox = this.SetUpHitBoxPlayer(sizeX, sizeY);
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(hitbox.minX, hitbox.minY, sizeX, sizeY);
        ctx.restore();

        // Red — full sprite frame boundary (entityPositionX/Y + PlayerSize)
        ctx.save();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.entityPositionX, this.entityPositionY, PlayerSize._WIDTH, PlayerSize._HEIGHT);
        ctx.restore();
    }

    PlayerSearchForTiles(matrix,
        min = [
            this.COM[0] - PlayerSize._WIDTH  * this.#TileViewField,
            this.COM[1] - PlayerSize._HEIGHT * this.#TileViewField
        ],
        max = [
            this.COM[0] + PlayerSize._WIDTH  * this.#TileViewField,
            this.COM[1] + PlayerSize._HEIGHT * this.#TileViewField
        ]
    ) {
        const results = [];
        for (let row = 0; row < matrix.length; row++) {
            for (let col = 0; col < matrix[row].length; col++) {
                const engaged = matrix[row][col];
                if (engaged.entityCenterOfMass) {
                    const valueX = engaged.entityCenterOfMass[0];
                    const valueY = engaged.entityCenterOfMass[1];
                    if (
                        valueX >= min[0] &&
                        valueX <= max[0] &&
                        valueY >= min[1] &&
                        valueY <= max[1]
                    ) {
                        results.push({ engaged });
                    }
                }
            }
        }
        return results;
    }

    PlayerCollisionDetectionHandler(NearbyTiles = [], matrix) {

        this.onGround = false;

        const tiles = this.PlayerSearchForTiles(matrix);
        if (tiles.length === 0) return;

        const hb = this.SetUpHitBoxPlayer();
        const intruders = tiles
            .map(({ engaged }) => engaged)
            .filter(tile => {
                const tx = tile.entityPositionX;
                const ty = tile.entityPositionY;
                return (
                    hb.maxX >= tx &&
                    hb.minX < tx + WorldConstants._BLOCKSIZEX &&
                    hb.maxY >= ty &&
                    hb.minY < ty + WorldConstants._BLOCKSIZEY
                );
            });

        this.PlayerCollisionHandler(intruders);
    }

    PlayerCollisionHandler(intruders = []) {
        if (intruders.length === 0) return;

        const OFFSET_X = (120 - 20) / 2;  // = 50
        const OFFSET_Y = 80 - 38;          // = 42
        const SIZE_X   = 20;
        const SIZE_Y   = 38;

        // ── Y axis first ────────────────────────────────────────────────────
        // Resolving Y before X avoids misclassifying floor corners as walls.
        for (const tile of intruders) {
            const hb = this.SetUpHitBoxPlayer();

            const tileTop    = tile.entityPositionY;
            const tileBottom = tile.entityPositionY + WorldConstants._BLOCKSIZEY;

            // Skip if no Y overlap
            if (hb.maxY <= tileTop || hb.minY >= tileBottom) continue;
            // Skip if no X overlap
            const tileLeft  = tile.entityPositionX;
            const tileRight = tile.entityPositionX + WorldConstants._BLOCKSIZEX;
            if (hb.maxX <= tileLeft || hb.minX >= tileRight) continue;

            const penetrationFromTop    = hb.maxY - tileTop;
            const penetrationFromBottom = tileBottom - hb.minY;

            if (penetrationFromTop <= penetrationFromBottom) {
                // Player came from above — land on tile

                this.entityPositionY = tileTop - OFFSET_Y - SIZE_Y;
                this.SetVelocity({ y: 0 });
                this.onGround = true;
            } else {
                // Player came from below — hit the ceiling

                this.entityPositionY = tileBottom - OFFSET_Y;
                this.SetVelocity({ y: 0 });
            }
        }

        // ── X axis second ───────────────────────────────────────────────────
        for (const tile of intruders) {
            const hb = this.SetUpHitBoxPlayer(); // recalculate after Y corrections above

            const tileTop    = tile.entityPositionY;
            const tileBottom = tile.entityPositionY + WorldConstants._BLOCKSIZEY;
            const tileLeft   = tile.entityPositionX;
            const tileRight  = tile.entityPositionX + WorldConstants._BLOCKSIZEX;

            // Skip if no overlap on either axis after Y resolution
            if (hb.maxY <= tileTop || hb.minY >= tileBottom) continue;
            if (hb.maxX <= tileLeft || hb.minX >= tileRight) continue;

            const penetrationFromLeft  = hb.maxX - tileLeft;
            const penetrationFromRight = tileRight - hb.minX;

            if (penetrationFromLeft <= penetrationFromRight) {
                // Player came from the left — push left
               
                this.SetVelocity({ x: 0 });
            } else {
                // Player came from the right — push right

                this.entityPositionX = tileRight - OFFSET_X;
                this.SetVelocity({ x: 0 });
            }
        }
    }
        DrawTileViewBox(ctx) {
        const boxWidth  = PlayerSize._WIDTH  * this.#TileViewField * 2;
        const boxHeight = PlayerSize._HEIGHT * this.#TileViewField * 2;

        const x = this.COM[0] - boxWidth / 2;
        const y = this.COM[1] - boxHeight / 2;

        ctx.save();
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, boxWidth, boxHeight);
        ctx.restore();
    }

    Developer(ctx, enabled, matrix){
        if (enabled){
            this.DrawTileViewBox(ctx);
            this.DrawHitBoxPlayer(ctx);
            this.PlayerSearchForTiles(matrix).forEach(t => {
            ctx.fillStyle = "rgba(115, 255, 0, 0.4)";
            ctx.fillRect(
                t.engaged.entityPositionX,
                t.engaged.entityPositionY,
                WorldConstants._BLOCKSIZEX,
                WorldConstants._BLOCKSIZEY
            );
        })};
    }
}