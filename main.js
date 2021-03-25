import {uuidv4} from "./modules/utils.mjs";
import {keys} from "./modules/keys.mjs";
import {ship} from "./modules/ship/ship.mjs";
import {asteroid} from "./modules/asteroid/asteroid.mjs";
import {controlSchemeLoader} from "./modules/ship/controls.mjs";

// Rebind keypress events to our own custom handler.
addEventListener("keyup", keys.event);
addEventListener("keydown", keys.event);
document.getElementById("control-schemes").addEventListener("change", (event) => { setControlScheme(event.target.value) });
document.getElementById("main-menu-submit-button").addEventListener("click", startGame);

// Makes a request to bring the window to the front. It may fail due to user settings and 
// the window isn't guaranteed to be frontmost before this method returns.
focus();

const SVG_NS = "http://www.w3.org/2000/svg";
const SPAWN_CENTER_OFFSET = {x: 1.0, y: 1.0};
const MAX_ASTEROIDS = 10;
let worldElement = document.getElementById("world-element");
let worldSvgElement = document.getElementById("world-svg-element");
const WORLD_BOUNDARY = {x: worldSvgElement.clientWidth, y: worldSvgElement.clientHeight};
let playerShipControlScheme = null;
let player;
let asteroids = [];

const ASTEROID_TEMPLATES = [
    "M 13.229173,13.229166 7.9375033,11.90625 h -5.29167 L 3.3333333e-6,7.9375003 6.6145833,2.6458333 H 10.583333 L 11.906253,6.3333333e-7 17.197923,1.3229176 l 2.64583,3.9687497 5.29167,1.322917 1.32291,2.645833 -2.64583,2.6458327 -5.29167,1.322917 -5.29166,-1e-6"
]

window.focus();

function setControlScheme(schemeId) {
    console.log("setControlScheme", schemeId);
    playerShipControlScheme = controlSchemeLoader(schemeId);
}

function createAndSpawnShip(shipShape, spawnOffset = SPAWN_CENTER_OFFSET) {
    // Ensure ship can't spawn oob.
    if ( 0 > spawnOffset.x || spawnOffset.x > WORLD_BOUNDARY.x || 
         0 > spawnOffset.y || spawnOffset.y > WORLD_BOUNDARY.y ) {
        console.error(`Attempted spawning ship OOB {x: ${spawnOffset.x}, y: ${spawnOffset.x}}, spawning at center instead!`);
        spawnOffset = SPAWN_CENTER_OFFSET;
    }
    
    // Add shape to the spaceship SVG container.
    worldSvgElement.appendChild(shipShape);
    
    // Add the spaceship.
    let shipTemplate = Object.assign({}, ship);
    
    // Spawn the spaceship.
    let shipElement = shipTemplate.create(shipShape, spawnOffset, playerShipControlScheme);
    
    return shipElement;
}

function createPlayerShape() {
    // Create spaceship shape in the SVG namespace.
    let playerShipShape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    playerShipShape.setAttributeNS(null, "id", "player");
    playerShipShape.classList.add("spaceship");
    playerShipShape.setAttributeNS(null, "points", "0,0 -5,10 30,0 -5,-10");

    console.log("playerShipShape", playerShipShape);

    return playerShipShape
}

function createAndSpawnAsteroid(asteroidShape, scale, spawnOffset = SPAWN_CENTER_OFFSET) {
    console.log("asteroidType", asteroidShape);
    console.log("Asteroid spawnOffset", spawnOffset);
    
    // Ensure asteroid can't spawn oob.
    if ( 0 > spawnOffset.x || spawnOffset.x > WORLD_BOUNDARY.x || 
         0 > spawnOffset.y || spawnOffset.y > WORLD_BOUNDARY.y ) {
        console.error(`Attempted spawning asteroid OOB {x: ${spawnOffset.x}, y: ${spawnOffset.x}}, spawning at center instead!`);
        spawnOffset = SPAWN_CENTER_OFFSET;
    }

    // Add shape to the spaceship SVG container.
    worldSvgElement.appendChild(asteroidShape);
    
    // Add the asteroid.
    let asteroidTemplate = Object.assign({}, asteroid);
    console.log("asteroidTemplate", asteroidTemplate);

    // Spawn the asteroid.
    let asteroidElement = asteroidTemplate.create(asteroidShape, scale, spawnOffset);

    // Give it initial momentum (ex: 0.00095)
    // 50-50 chance between left (-) or right (+) rotation.
    let deltaAngleDirecton = Math.random() < 0.5 ? 1000 : -1000;

    asteroidElement.move(Math.random() / 50, Math.random() / 50, Math.random() / deltaAngleDirecton);

    return asteroidElement;
}

/**
 * Creates an asteroid SVG element.
 * @returns Asteroid SVG element
 */
function createAsteroidShape() {
    // Pick a random asteroid type from ASTEROID_TEMPLATES (if more than 1 entry, else pick the 0th).
    let asteroidTypePick;
    // let asteroidTypePick = i === ASTEROID_TEMPLATES.length > 1 ? ASTEROID_TEMPLATES[Math.floor(Math.random() * (ASTEROID_TEMPLATES.length - 1)) + 1] : ASTEROID_TEMPLATES[0];
    if (ASTEROID_TEMPLATES.length > 1) {
        asteroidTypePick = ASTEROID_TEMPLATES[Math.floor(Math.random() * (ASTEROID_TEMPLATES.length - 1)) + 1];
    } else {
        asteroidTypePick = ASTEROID_TEMPLATES[0];
    }

    let asteroidShape = document.createElementNS(SVG_NS, "path");
    asteroidShape.setAttributeNS(SVG_NS, "id", `asteroid-${uuidv4()}`);
    asteroidShape.setAttribute("d", asteroidTypePick);
    asteroidShape.classList.add("asteroid");
    console.log("asteroidShape", asteroidShape);

    asteroidShape.setAttributeNS(SVG_NS, "stroke", Math.floor(Math.random()*16777215).toString(16));

    return asteroidShape;
}

/**
 * Creates and spawns a given amount of asteroid elements.
 * @param {} amount 
 */
function createAndSpawnAsteroids(amount = MAX_ASTEROIDS) {
    for (let i = 0; i < amount; i++) {
        let asteroidShape = createAsteroidShape();
    
        let anAsteroid = createAndSpawnAsteroid(asteroidShape, 10, {x: Math.random(), y: Math.random()});
        console.log("Asteroid spawned.", anAsteroid);
        asteroids.push(anAsteroid);
        console.log("asteriods", asteroids);
    }
}

function startGame() {
    // Spawn player
    let playerShape = createPlayerShape();
    player = createAndSpawnShip(playerShape);
    console.log("Player spawned.", player);

    // Spawn asteroids
    createAndSpawnAsteroids();

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
    
    // Update Asteroids FIXME: Only one atm.
    for (let i = 0; i < asteroids.length; i++) {
        asteroids[i].updatePos();
        asteroids[i].updateMovement();
    }

    // Request an animation frame with callback to self, so that it repeats/recurses infinitely.
    requestAnimationFrame(mainLoop);
}
