export const keys = {
    ArrowUp : false,
    ArrowLeft : false,
    ArrowRight : false,
    KeyW: false,
    KeyA: false,
    KeyD: false,

    event(e){ 
        if(keys[e.code] !== undefined){ 
            keys[e.code] = event.type === "keydown" ;
            e.preventDefault();
        } 
    }
}