export const KEYS ={
    
    _LWD: "A",
    _RWD: "D",
    _JMP: "Space",
    _DGE: "Alt",
    _AUX: "Shift", // auxiliary key for additional functions like sprint (Shift+A/D) etc.
    _ATK:  0, //LMB
    _ACT: "E",
    _PAU: "P",
    _DRP: "Q",
    _INV: "I"

}

export const PlayerStates ={

    _IDLE: "idle",
    _WALK: "walk",
    _RUN: "run",
    _ATTACK1: "attack1",
    _ATTACK2: "attack2",
    _ATTACK3: "attack3",
    _PARRY: "parry",
    _JUMP: "jump",
    _FALL: "fall",
    _HURT: "hurt",
    _DEATH: "death"
}
export const NonPlayerStates ={

    _NPCDEACTIVE: "nonactive",
    _NPCIDLE: "idle",
    _NPCWALK: "walk",
    _NPCRUN: "run",
    _NPCJUMP: "jump",
    _NPCFALL: "fall",
    _NPCATK: "attack",
    _NPCHURT: "hurt",
    _NPCDEATH: "death"
}
export const EnviromentStates ={
    
    _ENVIDLE: "idle",
    _ENVINTERACTED: "interacted"
}

export const PlayerSize ={
    _WIDTH: 128,
    _HEIGHT: 128
}

export const ScreenSize ={
    _WIDTH: window.innerWidth,
    _HEIGHT: window.innerHeight,
    _GROUND: window.innerHeight - PlayerSize._HEIGHT
}

export const WorldConstants ={
    _BLOCKSIZEX: 32,
    _BLOCKSIZEY: 32,
    _WORLDSIZEX: ScreenSize._WIDTH,
    _WORLDSIZEY: ScreenSize._HEIGHT
}

export const PlayerPhysics = {
    _BASE_SPEED:   0.15,    // px/ms  (~150 px/s)
    _SPRINT_MULT:  1.5,
    _GRAVITY:      0.0016,  // px/ms² (~800 px/s²)
    _JUMP_FORCE:  -0.6,     // px/ms  (~600 px/s upward)
}

/*****************************************
 * Allows you to input the location of   *
 * the correct image of the sprite sheet *
 *****************************************/

function getSpriteLoc(amountOfFrames, spritesheet_row, startFrame = 0) {
    let returnArr = [];
    for (let i = startFrame; i < amountOfFrames; i++) {
        returnArr[i-startFrame] = {
            x: PlayerSize._WIDTH * i,
            y: PlayerSize._HEIGHT * spritesheet_row
        };
    }
    return returnArr;
}

/*********************************************
 * Set locations of the sprites and how wide *
 *********************************************/

export const PlayerAnimations = {

    "idle":    { loc: getSpriteLoc(6, 0) },
    "walk":    { loc: getSpriteLoc(8, 1) },
    "run":     { loc: getSpriteLoc(7, 2) },
    "attack1": { loc: getSpriteLoc(5, 3) },
    "parry":   { loc: getSpriteLoc(2, 4) },
    "attack3": { loc: getSpriteLoc(5, 5) },
    "attack3": { loc: getSpriteLoc(5, 6) },
    "jump":    { loc: getSpriteLoc(4, 7, 3) },
    "fall":    { loc: getSpriteLoc(6, 7, 5)},
    "hurt":    { loc: getSpriteLoc(3, 8) },
    "death":   { loc: getSpriteLoc(4, 9) }

}
