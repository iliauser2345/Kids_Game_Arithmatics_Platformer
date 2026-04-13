const createImage = (src) => {
    const img = new Image();
    img.src = src;
    return img;
};

export const Images = {
    
    _PLAYER_IDLE:    createImage('./assets/Fancy_Knight/_Idle.png'),
    _PLAYER_WALK:    createImage('./assets/Fancy_Knight/_Run.png'),
    _PLAYER_DASH:     createImage('./assets/Fancy_Knight/_Dash.png'),
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
    _DASH: "dash",
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
    _GRIDSIZEX: Math.ceil(SCRDIMENSIONS._SCRWIDTH/SCRDIMENSIONS._TILEWIDTH),
    _GRIDSIZEY: Math.ceil(SCRDIMENSIONS._SCRHEIGHT/SCRDIMENSIONS._TILEHEIGHT),
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
    get _DASH_VELOCITY(){
        return this._BASE_SPEED * 3;
    }
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
    "dash":    { image: Images._PLAYER_DASH ,   loc: getSpriteLoc(2, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "attack1": { image: Images._PLAYER_ATTACK1, loc: getSpriteLoc(4, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "parry":   { image: Images._PLAYER_PARRY,   loc: getSpriteLoc(6, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "jump":    { image: Images._PLAYER_JUMP,    loc: getSpriteLoc(3, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "fall":    { image: Images._PLAYER_FALL,    loc: getSpriteLoc(3, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT)},
    "hurt":    { image: Images._PLAYER_HURT,    loc: getSpriteLoc(1, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) },
    "death":   { image: Images._PLAYER_DEATH,   loc: getSpriteLoc(10, 0, PlayerSize._WIDTH, PlayerSize._HEIGHT) }

}

// The source tileset has a 1px transparent separator between every tile.
// Tile visual size = 32px.  Source stride = 33px.
const TILE_SIZE   = WorldConstants._BLOCKSIZEX; // 32  (render/game size, unchanged)
const SRC_STRIDE  = 33;                          // ← was 32, off by 1px per column

function tile(col, row) {
  return { x: col * SRC_STRIDE, y: row * SRC_STRIDE };
}

// ─────────────────────────────────────────────────────────────────────────────
//  Shape legend used in comments
//    FULL   solid fill          HALF-T  top-half only
//    cutSW  bottom-left cut     cutSE   bottom-right cut
//    cutNW  top-left cut        cutNE   top-right cut
//    qSW    bottom-left only    qSE     bottom-right only
//
//  See tileset_grid.png for a labelled visual of every cell.
// ─────────────────────────────────────────────────────────────────────────────

export const BlockLoc = new Proxy({

  // ═══════════════════════════════════════════════════════════════════════════
  //  GRASS / DIRT  ·  cols 0–6
  //    rows 0–6  = surface / light palette
  //    rows 7–13 = deep / dark palette  (identical shape layout)
  // ═══════════════════════════════════════════════════════════════════════════

  // Surface cap (row 0)
  grassTL:              [0,  0],  // FULL
  grassTM:              [1,  0],  // FULL
  grassTR:              [2,  0],  // FULL
  grassInnerSE:         [3,  0],  // qSE  — concave corner SE
  grassInnerSW:         [4,  0],  // qSW  — concave corner SW
  grassCapSingle:       [5,  0],  // FULL — isolated single-block cap
  grassOuterSW:         [6,  0],  // cutSW

  // Interior dirt fill (row 1)
  dirtL:                [0,  1],  // FULL
  dirtM:                [1,  1],  // FULL
  dirtR:                [2,  1],  // FULL
  dirtLX:               [3,  1],  // FULL — extended-left variant
  dirtRX:               [4,  1],  // FULL — extended-right variant
  dirtAlt:              [5,  1],  // FULL — alternate fill
  dirtOuterSE:          [6,  1],  // cutSE

  // Slope row A (row 2)
  grassSl_cutSW_a:      [0,  2],  grassSl_full_a:    [1,  2],
  grassSl_cutSE_a:      [2,  2],  grassSl_full_b:    [3,  2],
  grassSl_full_c:       [4,  2],  grassSl_cutSE_b:   [5,  2],
  grassSl_full_d:       [6,  2],

  // Slope row B (row 3)
  grassSl_halfT_a:      [0,  3],  grassSl_full_e:    [1,  3],
  grassSl_cutSW_b:      [2,  3],  grassSl_full_f:    [3,  3],
  grassSl_cutSE_c:      [4,  3],  grassSl_cutSE_d:   [5,  3],
  grassSl_full_g:       [6,  3],

  // Slope row C (row 4)
  grassSl_full_h:       [0,  4],  grassSl_halfT_b:   [1,  4],
  grassSl_qSE_a:        [2,  4],  grassSl_cutNW_a:   [3,  4],
  grassSl_qSE_b:        [4,  4],  grassSl_cutSE_e:   [5,  4],

  // Slope row D (row 5)
  grassSl_halfT_c:      [0,  5],  grassSl_full_i:    [1,  5],
  grassSl_cutNE_a:      [2,  5],  grassSl_qSW_a:     [3,  5],
  grassSl_qSW_b:        [4,  5],  grassSl_full_j:    [5,  5],

  // Slope row E (row 6)
  grassSl_full_k:       [0,  6],  grassSl_halfT_d:   [1,  6],
  grassSl_cutNE_b:      [2,  6],  grassSl_qSW_c:     [3,  6],
  grassSl_qSE_c:        [4,  6],  grassSl_cutNW_b:   [5,  6],

  // Deep dirt cap (row 7) — same shapes as row 0, dark palette
  deepDirtTL:           [0,  7],  deepDirtTM:        [1,  7],  deepDirtTR:         [2,  7],
  deepDirtInnerSE:      [3,  7],  deepDirtInnerSW:   [4,  7],
  deepDirtCapSingle:    [5,  7],  deepDirtOuterSW:   [6,  7],

  // Deep dirt fill (row 8)
  deepDirtL:            [0,  8],  deepDirtM:         [1,  8],  deepDirtR:          [2,  8],
  deepDirtLX:           [3,  8],  deepDirtRX:        [4,  8],
  deepDirtAlt:          [5,  8],  deepDirtOuterSE:   [6,  8],

  // Deep dirt slopes (rows 9–13, identical shapes to rows 2–6)
  deepDirtSl_cutSW_a:   [0,  9],  deepDirtSl_full_a: [1,  9],  deepDirtSl_cutSE_a: [2,  9],
  deepDirtSl_full_b:    [3,  9],  deepDirtSl_full_c: [4,  9],  deepDirtSl_cutSE_b: [5,  9],
  deepDirtSl_full_d:    [6,  9],

  deepDirtSl_halfT_a:   [0, 10],  deepDirtSl_full_e: [1, 10],  deepDirtSl_cutSW_b: [2, 10],
  deepDirtSl_full_f:    [3, 10],  deepDirtSl_cutSE_c:[4, 10],  deepDirtSl_cutSE_d: [5, 10],
  deepDirtSl_full_g:    [6, 10],

  deepDirtSl_full_h:    [0, 11],  deepDirtSl_halfT_b:[1, 11],  deepDirtSl_qSE_a:   [2, 11],
  deepDirtSl_cutNW_a:   [3, 11],  deepDirtSl_qSE_b:  [4, 11],  deepDirtSl_cutSE_e: [5, 11],

  deepDirtSl_halfT_c:   [0, 12],  deepDirtSl_full_i: [1, 12],  deepDirtSl_cutNE_a: [2, 12],
  deepDirtSl_qSW_a:     [3, 12],  deepDirtSl_qSW_b:  [4, 12],  deepDirtSl_full_j:  [5, 12],

  deepDirtSl_full_k:    [0, 13],  deepDirtSl_halfT_d:[1, 13],  deepDirtSl_cutNE_b: [2, 13],
  deepDirtSl_qSW_c:     [3, 13],  deepDirtSl_qSE_c:  [4, 13],  deepDirtSl_cutNW_b: [5, 13],


  // ═══════════════════════════════════════════════════════════════════════════
  //  STONE / CAVE  ·  cols 7–13  ·  same layout as grass/dirt, shifted +7
  // ═══════════════════════════════════════════════════════════════════════════

  stoneTL:              [7,  0],  stoneTM:            [8,  0],  stoneTR:            [9,  0],
  stoneInnerSE:         [10, 0],  stoneInnerSW:       [11, 0],
  stoneCapSingle:       [12, 0],  stoneOuterSW:       [13, 0],

  stoneL:               [7,  1],  stoneM:             [8,  1],  stoneR:             [9,  1],
  stoneLX:              [10, 1],  stoneRX:            [11, 1],
  stoneAlt:             [12, 1],  stoneOuterSE:       [13, 1],

  stoneSl_cutSW_a:      [7,  2],  stoneSl_full_a:     [8,  2],  stoneSl_cutSE_a:    [9,  2],
  stoneSl_full_b:       [10, 2],  stoneSl_full_c:     [11, 2],  stoneSl_cutSE_b:    [12, 2],
  stoneSl_full_d:       [13, 2],

  stoneSl_halfT_a:      [7,  3],  stoneSl_full_e:     [8,  3],  stoneSl_cutSW_b:    [9,  3],
  stoneSl_full_f:       [10, 3],  stoneSl_cutSE_c:    [11, 3],  stoneSl_cutSE_d:    [12, 3],
  stoneSl_full_g:       [13, 3],

  stoneSl_full_h:       [7,  4],  stoneSl_halfT_b:    [8,  4],  stoneSl_qSE_a:      [9,  4],
  stoneSl_cutNW_a:      [10, 4],  stoneSl_qSE_b:      [11, 4],  stoneSl_cutSE_e:    [12, 4],

  stoneSl_halfT_c:      [7,  5],  stoneSl_full_i:     [8,  5],  stoneSl_cutNE_a:    [9,  5],
  stoneSl_qSW_a:        [10, 5],  stoneSl_qSW_b:      [11, 5],  stoneSl_full_j:     [12, 5],

  stoneSl_full_k:       [7,  6],  stoneSl_halfT_d:    [8,  6],  stoneSl_cutNE_b:    [9,  6],
  stoneSl_qSW_c:        [10, 6],  stoneSl_qSE_c:      [11, 6],  stoneSl_cutNW_b:    [12, 6],

  deepStoneTL:          [7,  7],  deepStoneTM:        [8,  7],  deepStoneTR:        [9,  7],
  deepStoneInnerSE:     [10, 7],  deepStoneInnerSW:   [11, 7],
  deepStoneCapSingle:   [12, 7],  deepStoneOuterSW:   [13, 7],

  deepStoneL:           [7,  8],  deepStoneM:         [8,  8],  deepStoneR:         [9,  8],
  deepStoneLX:          [10, 8],  deepStoneRX:        [11, 8],
  deepStoneAlt:         [12, 8],  deepStoneOuterSE:   [13, 8],

  deepStoneSl_cutSW_a:  [7,  9],  deepStoneSl_full_a: [8,  9],  deepStoneSl_cutSE_a:[9,  9],
  deepStoneSl_full_b:   [10, 9],  deepStoneSl_full_c: [11, 9],  deepStoneSl_cutSE_b:[12, 9],
  deepStoneSl_full_d:   [13, 9],

  deepStoneSl_halfT_a:  [7, 10],  deepStoneSl_full_e: [8, 10],  deepStoneSl_cutSW_b:[9, 10],
  deepStoneSl_full_f:   [10,10],  deepStoneSl_cutSE_c:[11,10],  deepStoneSl_cutSE_d:[12,10],
  deepStoneSl_full_g:   [13,10],

  deepStoneSl_full_h:   [7, 11],  deepStoneSl_halfT_b:[8, 11],  deepStoneSl_qSE_a:  [9, 11],
  deepStoneSl_cutNW_a:  [10,11],  deepStoneSl_qSE_b:  [11,11],  deepStoneSl_cutSE_e:[12,11],

  deepStoneSl_halfT_c:  [7, 12],  deepStoneSl_full_i: [8, 12],  deepStoneSl_cutNE_a:[9, 12],
  deepStoneSl_qSW_a:    [10,12],  deepStoneSl_qSW_b:  [11,12],  deepStoneSl_full_j: [12,12],

  deepStoneSl_full_k:   [7, 13],  deepStoneSl_halfT_d:[8, 13],  deepStoneSl_cutNE_b:[9, 13],
  deepStoneSl_qSW_c:    [10,13],  deepStoneSl_qSE_c:  [11,13],  deepStoneSl_cutNW_b:[12,13],


  // ═══════════════════════════════════════════════════════════════════════════
  //  CASTLE  ·  cols 14–20
  //    rows 0–6  = exterior / light stone
  //    rows 7–13 = interior / dark stone  (mirrors rows 0–6)
  // ═══════════════════════════════════════════════════════════════════════════

  // Exterior — battlement / wall top (row 0)
  castleWallTL:         [14, 0],  // FULL
  castleWallTM:         [15, 0],  // FULL
  castleWallTR:         [16, 0],  // FULL
  castleColumnTop:      [17, 0],  // sparse — pillar cap
  castleArchCapL:       [18, 0],  // qSW   — arch top-left corner

  // Exterior — wall body row 1
  castleWallML:         [14, 1],
  castleWallMM:         [15, 1],
  castleWallMR:         [16, 1],
  castleColumnM:        [17, 1],  // sparse — pillar body
  castleGateL:          [18, 1],  // FULL DRK — gate left panel
  castleGateNarrowR:    [19, 1],  // right-half — thin gate frame
  castleGateR:          [20, 1],  // FULL DRK — gate right panel

  // Exterior — wall body row 2 (slightly darker band)
  castleWallDarkL:      [14, 2],
  castleWallDarkM:      [15, 2],
  castleWallDarkR:      [16, 2],
  castleColumnM2:       [17, 2],  // sparse — pillar body lower
  castleGateL2:         [18, 2],
  castleGateNarrowR2:   [19, 2],
  castleGateWoodR:      [20, 2],  // brownish — wooden gate plank

  // Exterior — wall base (row 3)
  castleWallBL:         [14, 3],
  castleWallBM:         [15, 3],
  castleWallBR:         [16, 3],
  castleWallB2:         [17, 3],
  castleGateBaseL:      [18, 3],
  castleGateBaseM:      [19, 3],
  castleGateBaseR:      [20, 3],

  // Exterior — floor / platform (row 4)
  castleFloorL:         [14, 4],
  castleFloorM:         [15, 4],
  castleFloorR:         [16, 4],
  castleFloorAccent:    [17, 4],  // greenish tint — mossy stone
  castleFloorDark:      [18, 4],

  // Exterior — base row (row 5)
  castleBaseL:          [14, 5],
  castleBaseM:          [15, 5],
  castleBaseSingle:     [16, 5],  // sparse — single isolated base block

  // Exterior — outer base corners (row 6)
  castleCornerNW:       [14, 6],  // cutNW
  castleCornerM:        [15, 6],  // FULL
  castleCornerNE:       [16, 6],  // cutNE

  // Interior / dungeon — same structure, rows 7–13
  castleIntWallTL:      [14, 7],  castleIntWallTM:    [15, 7],  castleIntWallTR:    [16, 7],
  castleIntColumnTop:   [17, 7],  castleIntArchCapL:  [18, 7],

  castleIntWallML:      [14, 8],  castleIntWallMM:    [15, 8],  castleIntWallMR:    [16, 8],
  castleIntColumnM:     [17, 8],  castleIntGateL:     [18, 8],  castleIntGateNarrowR:[19,8],

  castleIntWallDarkL:   [14, 9],  castleIntWallDarkM: [15, 9],  castleIntWallDarkR: [16, 9],
  castleIntColumnM2:    [17, 9],  castleIntGateL2:    [18, 9],  castleIntGateNarrowR2:[19,9],

  castleIntWallBL:      [14,10],  castleIntWallBM:    [15,10],  castleIntWallBR:    [16,10],
  castleIntWallB2:      [17,10],  castleIntGateBaseL: [18,10],  castleIntGateBaseM: [19,10],

  castleIntFloorL:      [14,11],  castleIntFloorM:    [15,11],  castleIntFloorR:    [16,11],
  castleIntFloorAccent: [17,11],  castleIntFloorDark: [18,11],

  castleIntBaseL:       [14,12],  castleIntBaseM:     [15,12],  castleIntBaseSingle:[16,12],

  castleIntCornerNW:    [14,13],  castleIntCornerM:   [15,13],  castleIntCornerNE:  [16,13],


  // ═══════════════════════════════════════════════════════════════════════════
  //  SKY / CLOUDS  ·  cols 20–22  ·  rows 0–3 only
  // ═══════════════════════════════════════════════════════════════════════════

  skyBlue:              [20, 0],  // clear blue sky fill
  skyCloudTL:           [21, 0],  skyCloudTR:         [22, 0],
  skyCloudBL:           [21, 1],  skyCloudBR:         [22, 1],
  skyGrayA:             [21, 2],  skyGrayB:           [22, 2],  // overcast / fog
  skyGrayC:             [21, 3],  skyGrayD:           [22, 3],

}, {
  get(target, name) {
    if (!(name in target)) throw new Error(`Unknown tile: "${name}"`);
    return tile(...target[name]);
  },
});
