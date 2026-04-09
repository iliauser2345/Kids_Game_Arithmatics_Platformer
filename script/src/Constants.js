const createImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

export const Images = {
    _PLAYER: createImage('./assets/Knight_spritelist.png'),
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

    _SCRHEIGHT: window.screen.availHeight,
    _SCRWIDTH:  window.screen.availWidth,
    _TILEHEIGHT: 36, //px
    _TILEWIDTH:  40 //px
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
    _HEIGHT: window.innerHeight
}

export const WorldConstants = {
    _BLOCKSIZEX: 32,
    _BLOCKSIZEY: 32,
    _WORLDSIZEX: ScreenSize._WIDTH,
    _WORLDSIZEY: ScreenSize._HEIGHT,
    get _GROUND() {
        // Same row formula as World.js: (rows - 1) * blockSize
        const groundTileY = (Math.ceil(ScreenSize._HEIGHT / this._BLOCKSIZEY) - 1) * this._BLOCKSIZEY;
        return groundTileY - PlayerSize._HEIGHT;
    }
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

    "idle":    { loc: getSpriteLoc(6, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "walk":    { loc: getSpriteLoc(8, 1, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "run":     { loc: getSpriteLoc(7, 2, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "attack1": { loc: getSpriteLoc(5, 3, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "parry":   { loc: getSpriteLoc(2, 4, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "attack3": { loc: getSpriteLoc(5, 5, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "attack3": { loc: getSpriteLoc(5, 6, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "jump":    { loc: getSpriteLoc(4, 7, PlayerSize._WIDTH, PlayerSize._HEIGHT, 3) },
    "fall":    { loc: getSpriteLoc(6, 7, PlayerSize._WIDTH, PlayerSize._HEIGHT, 5)},
    "hurt":    { loc: getSpriteLoc(3, 8, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "death":   { loc: getSpriteLoc(4, 9, PlayerSize._WIDTH, PlayerSize._HEIGHT) }

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
