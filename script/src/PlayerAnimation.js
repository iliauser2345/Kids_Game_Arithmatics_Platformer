/*****************************************
 * Allows you to input the location of   *
 * the correct image of the sprite sheet *
 *****************************************/
import { PlayerSize } from "./Constants";


function getSpriteLoc(amountOfFrames,spritesheet_row){
    let returnarr = [];
    for (let i = 0;i<=amountOfFrames;i++){
        returnarr[i]={
            x: PlayerSize._WIDTH*i,
            y: PlayerSize._HEIGHT*spritesheet_row
        };
    }
    return returnarr;
}

/*********************************************
 * Set locations of the sprites and how wide *
 *********************************************/

spriteAnimations = {
    "Idle": {
        loc: getSpriteLoc(6,0)
    },
    "Walk": {
        loc: getSpriteLoc(8,1)
    },
    "Run": {
        loc: getSpriteLoc(7,2)
    },
    "Attack1": {
        loc: getSpriteLoc(5,3)
    },
    "Attack2": {
        loc: getSpriteLoc(2,4)
    },
    "Attack3": {
        loc: getSpriteLoc(5,5)
    }, 
    "Attack4": {
        loc: getSpriteLoc(5,6)
    },
    "Jump": {
        loc: getSpriteLoc(6,7)
    },
    "Hurt": {
        loc: getSpriteLoc(3,8)
    },
    "Die": {
        loc: getSpriteLoc(4,9)
    },
}