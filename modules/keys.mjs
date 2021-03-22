export const keys = {
    ArrowUp : false,
    ArrowLeft : false,
    ArrowRight : false,
    KeyW: false,
    KeyA: false,
    KeyD: false,
    Digit1 : false,
    Digit2 : false,
    Digit3 : false,
    Digit4 : false,
    Digit5 : false,
    event(e){ 
        if(keys[e.code] !== undefined){ 
            keys[e.code] = event.type === "keydown" ;
            e.preventDefault();
        } 
    }
}