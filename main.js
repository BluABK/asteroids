// Rebind keypress events to our own custom handler.
document.addEventListener("keydown", function(event) {
    if (event.defaultPrevented) {
      return; // Do nothing if event already handled
    }

    // console.log("Adding keydown event listener...");
  
    switch(event.code) {
      case "KeyS":
      case "ArrowDown":
        // Handle "back"
        updatePosition(-spaceshipMoveRate);
        break;
      case "KeyW":
      case "ArrowUp":
        // Handle "forward"
        updatePosition(spaceshipMoveRate);
        break;
      case "KeyA":
      case "ArrowLeft":
        // Handle "turn left"
        spaceshipAngle -= spaceshipTurnRate;
        break;
      case "KeyD":
      case "ArrowRight":
        // Handle "turn right"
        spaceshipAngle += spaceshipTurnRate;
        break;
    }
    
    // Update world.
    refresh();

    // Consume the event so it doesn't get handled twice
    event.preventDefault(); // FIXME: Make sure to only consume the intended keys, currently it consumes all.
  }, true);

let world = {
    width: document.getElementById("world-svg-element").clientWidth,
    height: document.getElementById("world-svg-element").clientHeight,
    boundaryX: document.getElementById("world-svg-element").clientWidth -1,
    boundaryY: document.getElementById("world-svg-element").clientHeight -1
};

console.log("Hello World!", world);

let spaceshipMoveRate = 15;
let spaceshipTurnRate = Math.PI * 2;
// Start with spaceship facing "north".
let spaceshipAngle = 0;
let spaceship = document.getElementById("spaceship");

let spaceshipSize = {
    width: 30,
    height: 30
};
  
let position = {
    // Start at the centre of the world.
    x: world.width / 2,
    y: world.height / 2
};

/**
 * Updates current position with an offset (usually spaceship move rate).
 * 
 * @param {} offset 
 */
function updatePosition(offset) {
    let rad = spaceshipAngle * (Math.PI / 180);
    position.x += (Math.sin(rad) * offset);
    position.y -= (Math.cos(rad) * offset);
    
    // Ensure spaceship stays within bounds (X-axis).
    if (position.x < 0) {
        position.x = world.boundaryX;
    } else if (position.x > world.boundaryX) {
        position.x = 0;
    }
    
    // Ensure spaceship stays within bounds (Y-axis).
    if (position.y < 0) {
        position.y = world.boundaryY;
    } else if (position.y > world.boundaryY) {
        position.y = 0;
    }
    
    console.log(`Update position [${position.x}, ${position.y}] (offset: ${offset})...`);
}

function refresh() {
    // console.log("Refreshing...");
    let x = position.x - (spaceshipSize.width / 2);
    let y = position.y - (spaceshipSize.height / 2);
    let transform = "translate(" + x + " " + y + ") rotate(" + spaceshipAngle + " 15 15) ";

    spaceship.setAttribute("transform", transform);
}

/**
 * Global code to run last.
 */

// Initial refresh call to ensure we start with all the intended defaults.
refresh();
// Make ship visisble (starts invisible to avoid glitchy-looking repositioning pre initial refresh).
spaceship.style.display = "block";