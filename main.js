import {keys} from "./modules/keys.mjs";
import {ship} from "./modules/ship.mjs";

// // Settings items.
// document.getElementById("set-spaceship-move-rate").addEventListener("input", function() { setSpaceshipMoveRate(this.value)});
// document.getElementById("set-spaceship-turn-rate").addEventListener("input", function() { setSpaceshipTurnRate(this.value)});

// requestAnimationFrame(mainLoop);

// Rebind keypress events to our own custom handler.
addEventListener("keyup", keys.event);
addEventListener("keydown", keys.event);

// Makes a request to bring the window to the front. It may fail due to user settings and 
// the window isn't guaranteed to be frontmost before this method returns.
focus();

// let worldElement = document.getElementById("world-svg-element");

// let world = {
//     width: document.getElementById("world-svg-element").clientWidth,
//     height: document.getElementById("world-svg-element").clientHeight,
//     boundaryX: document.getElementById("world-svg-element").clientWidth -1,
//     boundaryY: document.getElementById("world-svg-element").clientHeight -1
// };

// console.log("Hello World!", world);

// const SPACESHIP_DEFAULT_MOVE_RATE = 15;
// const SPACESHIP_DEFAULT_TURN_RATE = Math.PI * 2;

// let spaceshipMoveRate = SPACESHIP_DEFAULT_MOVE_RATE;
// let spaceshipTurnRate = SPACESHIP_DEFAULT_TURN_RATE;
// // Start with spaceship facing "north".
// let spaceshipAngle = 0;
// // let spaceship = document.getElementById("spaceship");

// let spaceshipSize = {
//     width: 30,
//     height: 30
// };

// let position = {
//     // Start at the centre of the world.
//     x: world.width / 2,
//     y: world.height / 2
// };

// function setSpaceshipMoveRate(rate = SPACESHIP_DEFAULT_MOVE_RATE) {
//     console.log(`Setting spaceship move rate: ${spaceshipMoveRate} --> ${rate}`, rate);
//     spaceshipMoveRate = rate;

//     // Update HTML.
//     document.getElementById("set-spaceship-move-rate").innerHTML = rate;
//     document.getElementById("spaceship-move-rate-indicator").innerHTML = rate;
// }

// function setSpaceshipTurnRate(rate = SPACESHIP_DEFAULT_TURN_RATE) {
//     console.log(`Setting spaceship turn rate: ${spaceshipTurnRate} --> ${rate}`, rate);
//     spaceshipTurnRate = rate;

//     // Update HTML.
//     document.getElementById("set-spaceship-turn-rate").innerHTML = rate;
//     document.getElementById("spaceship-turn-rate-indicator").innerHTML = rate;
// }

// /**
//  * Updates current position with an offset (usually spaceship move rate).
//  *
//  * @param {} offset
//  */
// function updatePosition(offset) {
//     let rad = spaceshipAngle * (Math.PI / 180);
//     position.x += (Math.sin(rad) * offset);
//     position.y -= (Math.cos(rad) * offset);

//     // Ensure spaceship stays within bounds (X-axis).
//     if (position.x < 0) {
//         position.x = world.boundaryX;
//     } else if (position.x > world.boundaryX) {
//         position.x = 0;
//     }

//     // Ensure spaceship stays within bounds (Y-axis).
//     if (position.y < 0) {
//         position.y = world.boundaryY;
//     } else if (position.y > world.boundaryY) {
//         position.y = 0;
//     }

//     console.log(`Update position [${position.x}, ${position.y}] (offset: ${offset})...`);
// }

// Object holding all ship objects.
const ships = {
    items : [],
    controling : 0,
    add(ship){ this.items.push(ship) },
    update(){
        var i;
        
        for(i = 0; i < this.items.length; i++){
            if(keys["Digit" + (i+1)]){
                if(this.controling !== -1){
                    this.items[this.controling].element.style.color = "green";
                    this.items[this.controling].hasControl = false;
                }
                this.controling = i;
                this.items[i].element.style.color = "red";
                this.items[i].hasControl = true;
            }
            this.items[i].updateUserIO();
            this.items[i].updatePos();
        }
    }
}

////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////

// var contain = document.getElementById("world");
// // var contain = document.createElement("div");
// contain.setAttribute("id", "contain");
// contain.style.position = "absolute";
// contain.style.top = contain.style.left = "0px";
// contain.style.width = contain.style.height = "100%";
// contain.style.overflow = "hidden";
// document.body.appendChild(contain);
window.focus();

// worldElement.appendChild("span");
var world = document.getElementById("world-element");
// Add spaceship.
ships.add(Object.assign({}, ship).create("=Scl>", world, -0.4, "oldSchool"));
ships.add(Object.assign({},ship).create("=Drg>",world,-0.25,"oldSchoolDrag"));
ships.add(Object.assign({},ship).create("=Fast>",world,-0.1,"speedster"));
ships.add(Object.assign({},ship).create("=Nimble>",world,0.05,"speedLimiter"));
ships.add(Object.assign({},ship).create("=Rev>",world,0.2,"engineRev"));
// function update() {
//     let x = position.x - (spaceshipSize.width / 2);
//     let y = position.y - (spaceshipSize.height / 2);
//     let transform = "translate(" + x + " " + y + ") rotate(" + spaceshipAngle + " 15 15) ";

//     spaceship.setAttribute("transform", transform);
// }

/**
 * Global code to run last.
 */


// Make ship visisble (starts invisible to avoid glitchy-looking repositioning pre initial update).
// spaceship.style.display = "block";

// Run various setters so that HTML page gets updated with correct info.
// setSpaceshipMoveRate();
// setSpaceshipTurnRate();

/**
 * The main loop.
 */
function mainLoop(){
    ships.update();
    // update();
    // Request an animation frame with callback to self, so that it repeats/recurses infinitely.
    requestAnimationFrame(mainLoop);
}

// Tell the browser that we wish to perform an animation and request that the browser
// call a specified function to update an animation before the next repaint.
requestAnimationFrame(mainLoop);
