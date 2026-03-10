export class Window{

    constructor(){

    }
    // methods
    LoadWindow(cause){
        switch(cause){
            case "start":
                console.log("startwind");
                break;
            case "death":
                console.log("death");
                break;
            case "loose":
                console.log("lost");
                break;
            case "win":
                console.log("win");
                break;
        }
    }


}