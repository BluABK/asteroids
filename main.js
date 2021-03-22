import {keys} from "./modules/keys.mjs";
import {ship} from "./modules/ship/ship.mjs";
import {controlSchemeLoader} from "./modules/ship/controls.mjs";

// // Settings items.
// document.getElementById("set-spaceship-move-rate").addEventListener("input", function() { setSpaceshipMoveRate(this.value)});
// document.getElementById("set-spaceship-turn-rate").addEventListener("input", function() { setSpaceshipTurnRate(this.value)});

// Rebind keypress events to our own custom handler.
addEventListener("keyup", keys.event);
addEventListener("keydown", keys.event);
document.getElementById("control-schemes").addEventListener("change", (event) => { setControlScheme(event.target.value) });
document.getElementById("main-menu-submit-button").addEventListener("click", startGame);

// Makes a request to bring the window to the front. It may fail due to user settings and 
// the window isn't guaranteed to be frontmost before this method returns.
focus();

let worldElement = document.getElementById("world-element");
let worldSvgElement = document.getElementById("world-svg-element");
// Controls avail: oldSchool, oldSchoolDrag, speedster, speedLimiter, engineRev
let playerShipControlScheme = null;
let playerShipShape;
let player;

// Create spaceship shape in the SVG namespace.
playerShipShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
playerShipShape.setAttributeNS(null, "id", "spaceship");
playerShipShape.setAttributeNS(null, "points", "0,0 -5,10 30,0 -5,-10");

window.focus();

function setControlScheme(schemeId) {
    console.log("setControlScheme", schemeId);
    playerShipControlScheme = controlSchemeLoader(schemeId);
}

function createAndSpawnShip(shipShape) {    
    // Add shape to the spaceship SVG container.
    worldSvgElement.appendChild(shipShape);
    
    // Add the spaceship.
    let shipTemplate = Object.assign({}, ship);
    
    // Spawn the spaceship.
    let shipElement = shipTemplate.create(shipShape, {x: 0.325, y: 1.0}, playerShipControlScheme);
    
    return shipElement;
}

function startGame() {
    player = createAndSpawnShip(playerShipShape);
    console.log("Player spawned.", player);

    // Tell the browser that we wish to perform an animation and request that the browser
    // call a specified function to update an animation before the next repaint.
    requestAnimationFrame(mainLoop);
}

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
