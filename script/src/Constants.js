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
    _ATTACK4: "attack4",
    _JUMP: "jump",
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
    _WIDTH: 125,
    _HEIGHT: 130
}

/*****************************************
 * Allows you to input the location of   *
 * the correct image of the sprite sheet *
 *****************************************/

function getSpriteLoc(amountOfFrames, spritesheet_row) {
    let returnArr = [];
    for (let i = 0; i < amountOfFrames; i++) {
        returnArr[i] = {
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

    "Idle":    { loc: getSpriteLoc(6, 0) },
    "Walk":    { loc: getSpriteLoc(8, 1) },
    "Run":     { loc: getSpriteLoc(7, 2) },
    "Attack1": { loc: getSpriteLoc(5, 3) },
    "Attack2": { loc: getSpriteLoc(2, 4) },
    "Attack3": { loc: getSpriteLoc(5, 5) },
    "Attack4": { loc: getSpriteLoc(5, 6) },
    "Jump":    { loc: getSpriteLoc(6, 7) },
    "Hurt":    { loc: getSpriteLoc(3, 8) },
    "Death":   { loc: getSpriteLoc(4, 9) }

}
