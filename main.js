import {keys} from "./modules/keys.mjs";
import {ship} from "./modules/ship/ship.mjs";
import {controlSchemeLoader} from "./modules/ship/controls.mjs";

// // Settings items.
// document.getElementById("set-spaceship-move-rate").addEventListener("input", function() { setSpaceshipMoveRate(this.value)});
// document.getElementById("set-spaceship-turn-rate").addEventListener("input", function() { setSpaceshipTurnRate(this.value)});

// Rebind keypress events to our own custom handler.
addEventListener("keyup", keys.event);
addEventListener("keydown", keys.event);

// Makes a request to bring the window to the front. It may fail due to user settings and 
// the window isn't guaranteed to be frontmost before this method returns.
focus();

let worldElement = document.getElementById("world-element");
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

// FIXME: Kept for later non-player object use.
// // Object holding all ship objects.
// const ships = {
//     items : [],
//     controling : 0,
//     add(ship){ this.items.push(ship) },
//     update(){
//         for(let i = 0; i < this.items.length; i++){
//             this.items[i].updateUserIO();
//             this.items[i].updatePos();
//         }
//     }
// }

window.focus();

let shipSvgElement = document.getElementById("world-svg-element");

// Create player/spaceship shape in the SVG namespace.
let shipShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
shipShape.setAttributeNS(null, "id", "spaceship");
shipShape.setAttributeNS(null, "points", "0,0 -5,10 30,0 -5,-10");
// Add shape to the spaceship SVG container.
shipSvgElement.appendChild(shipShape);

// Add spaceship.
var shipTemplate = Object.assign({}, ship);
// Controls avail: oldSchool, oldSchoolDrag, speedster, speedLimiter, engineRev
let shipControlScheme = controlSchemeLoader("speedLimiter");
// Spawn player spaceship.
var player = shipTemplate.create(shipShape, {x: 0.31, y: 1.0});
console.log("Player spawned.", player);

/**
 * The main loop.
 */
function mainLoop(){
    // Update player.
    player.updateUserIO();
    player.updatePos();

    // Request an animation frame with callback to self, so that it repeats/recurses infinitely.
    requestAnimationFrame(mainLoop);
}

// Tell the browser that we wish to perform an animation and request that the browser
// call a specified function to update an animation before the next repaint.
requestAnimationFrame(mainLoop);
