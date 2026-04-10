const createImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

export const Images = {
    
    _PLAYER_IDLE:    createImage('./assets/Fancy_Knight/_Idle.png'),
    _PLAYER_WALK:    createImage('./assets/Fancy_Knight/_Run.png'),
    _PLAYER_RUN:     createImage('./assets/Fancy_Knight/_Dash.png'),
    _PLAYER_ATTACK1: createImage('./assets/Fancy_Knight/_Attack.png'),
    _PLAYER_PARRY:   createImage('./assets/Fancy_Knight/_Attack2.png'),
    _PLAYER_JUMP:    createImage('./assets/Fancy_Knight/_Jump.png'),
    _PLAYER_FALL:    createImage('./assets/Fancy_Knight/_Fall.png'),
    _PLAYER_HURT:    createImage('./assets/Fancy_Knight/_Hit.png'),
    _PLAYER_DEATH:   createImage('./assets/Fancy_Knight/_Death.png'),

    _ENVIRONMENT: createImage('./assets/Tileset.png'),
    _BACKGROUND: createImage('./assets/PLACEHOLDER_bgr_image.jpg'), // Even uitvogelen hoe dit nou echt toegepast moet worden

};

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

export const SCRDIMENSIONS ={

    _SCRHEIGHT: 1080,
    _SCRWIDTH:  1920,
    _TILEHEIGHT: 32, //px
    _TILEWIDTH:  32 //px
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
    _WIDTH: 120,
    _HEIGHT: 80
}

export const ScreenSize ={
    _WIDTH: window.screen.availWidth,
    _HEIGHT: window.screen.availHeight
}

export const WorldConstants = {
    _BLOCKSIZEX: 32,
    _BLOCKSIZEY: 32,
    _WORLDSIZEX: ScreenSize._WIDTH,
    _WORLDSIZEY: ScreenSize._HEIGHT,
    _GRIDSIZEX: SCRDIMENSIONS._SCRWIDTH/SCRDIMENSIONS._TILEWIDTH,
    _GRIDSIZEY: SCRDIMENSIONS._SCRHEIGHT/SCRDIMENSIONS._TILEHEIGHT,
    get _GROUND() {
        // Same row formula as World.js: (rows - 1) * blockSize
        const groundTileY = (Math.ceil(SCRDIMENSIONS._SCRHEIGHT / this._BLOCKSIZEY) - 1) * this._BLOCKSIZEY;
        return groundTileY - PlayerSize._HEIGHT;
    }
}

export const PlayerPhysics = {
    _BASE_SPEED:   0.15,    // px/ms  (~150 px/s)
    _SPRINT_MULT:  1.5,
    _GRAVITY:      0.0016,  // px/ms² (~800 px/s²)
    _JUMP_FORCE:  -0.6,     // px/ms  (~600 px/s upward) // jumps 118 px high
}

/*****************************************
 * Allows you to input the location of   *
 * the correct image of the sprite sheet *
 *****************************************/

function getSpriteLoc(frames, row, w, h, startFrame = 0) {
    let returnArr = [];
    for (let i = startFrame; i < frames; i++) {
        returnArr[i-startFrame] = {
            x: w * i,
            y: h * row
        };
    }
    return returnArr;
}

/*********************************************
 * Set locations of the sprites and how wide *
 *********************************************/

export const PlayerAnimations = {

    "idle":    { image: Images._PLAYER_IDLE,    loc: getSpriteLoc(10, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "walk":    { image: Images._PLAYER_WALK,    loc: getSpriteLoc(10, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "run":     { image: Images._PLAYER_RUN ,    loc: getSpriteLoc(2, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "attack1": { image: Images._PLAYER_ATTACK1, loc: getSpriteLoc(4, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "parry":   { image: Images._PLAYER_PARRY,   loc: getSpriteLoc(6, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "jump":    { image: Images._PLAYER_JUMP,    loc: getSpriteLoc(3, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "fall":    { image: Images._PLAYER_FALL,    loc: getSpriteLoc(3, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT)},
    "hurt":    { image: Images._PLAYER_HURT,    loc: getSpriteLoc(1, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "death":   { image: Images._PLAYER_DEATH,   loc: getSpriteLoc(10, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) }

}


const TILE_SIZE = WorldConstants._BLOCKSIZEX; // 32

function tile(col, row) {
    return { x: col * TILE_SIZE, y: row * TILE_SIZE };
}

export const BlockLoc = new Proxy({
    // Grass / Dirt
    grassTL:   [0, 0],
    grassTM:   [1, 0],
    grassTR:   [2, 0],
    dirtML:    [0, 1],
    dirtMM:    [1, 1],
    dirtMR:    [2, 1],
    // Stone
    stoneTL:   [5, 0],
    stoneTM:   [6, 0],
    // ... pendign
}, {
    get(target, name) {
        if (!(name in target)) throw new Error(`Unknown tile: "${name}"`);
        return tile(...target[name]);
    }
});
