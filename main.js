import {keys} from "./modules/keys.mjs";
import {ship} from "./modules/ship/ship.mjs";
import {asteroid} from "./modules/asteroid/asteroid.mjs";
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

const SVG_NS = "http://www.w3.org/2000/svg";

let worldElement = document.getElementById("world-element");
let worldSvgElement = document.getElementById("world-svg-element");
// Controls avail: oldSchool, oldSchoolDrag, speedster, speedLimiter, engineRev
let playerShipControlScheme = null;
let playerShipShape;
let player;

let myAsteroid;

// Create spaceship shape in the SVG namespace.
playerShipShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
playerShipShape.setAttributeNS(null, "id", "spaceship");
playerShipShape.setAttributeNS(null, "points", "0,0 -5,10 30,0 -5,-10");

console.log("playerShipShape", playerShipShape);

// let asteroidType2 = document.getElementById("svg-asteroid2").contentDocument.rootElement.children.layer1.children.path124; // 
let asteroidType2 = document.createElementNS(SVG_NS, "path");
asteroidType2.setAttributeNS(SVG_NS, "id", "asteroid2");
asteroidType2.setAttribute("d", "M 13.229173,13.229166 7.9375033,11.90625 h -5.29167 L 3.3333333e-6,7.9375003 6.6145833,2.6458333 H 10.583333 L 11.906253,6.3333333e-7 17.197923,1.3229176 l 2.64583,3.9687497 5.29167,1.322917 1.32291,2.645833 -2.64583,2.6458327 -5.29167,1.322917 -5.29166,-1e-6");
asteroidType2.classList.add("asteroid");
console.log("asteroidType2", asteroidType2);

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

function clone(element){
    let clonedElement = element.cloneNode(true);
    // clonedElement.id="newPawn1"
    worldSvgElement.appendChild(clonedElement)
    console.log("clone()", element, clonedElement);
    return clonedElement;
}

function createAndSpawnAsteroid(asteroidType, scale, pos = {x: 0, y: 0}) {
    // Add shape to the spaceship SVG container.
    worldSvgElement.appendChild(asteroidType);

    console.log("asteroidType", asteroidType);

    // Make a copy of the template asteroid SVG.
    // let asteroidClone = JSON.parse(JSON.stringify(asteroidType));
    // let asteroidClone = clone(asteroidType);
    // console.log("asteroidClone", asteroidClone);
    // asteroidClone.setAttribute("pos", pos);
    // asteroidClone.classList.remove("unspawned-object");
    

    // Add the asteroid.
    // let asteroidTemplate = Object.assign({}, asteroidClone);
    let asteroidTemplate = Object.assign({}, asteroidType);
    console.log("asteroidTemplate", asteroidTemplate);

    // Spawn the asteroid.
    // let asteroidElement = asteroid.create(asteroidClone, pos);
    let asteroidElement = asteroid.create(asteroidType, scale, pos);

    return asteroidElement;
}

function startGame() {
    // Spawn player
    player = createAndSpawnShip(playerShipShape);
    console.log("Player spawned.", player);

    // Spawn asteroids
    myAsteroid = createAndSpawnAsteroid(asteroidType2, 15, {x: Math.random(), y: Math.random()});
    console.log("Asteroid spawned.", myAsteroid);

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
    
    // Update Asteroids
    myAsteroid.updatePos();

    // Request an animation frame with callback to self, so that it repeats/recurses infinitely.
    requestAnimationFrame(mainLoop);
}
