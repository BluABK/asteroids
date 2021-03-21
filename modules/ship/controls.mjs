import {keys} from "../keys.mjs";

export function oldSchool(ship) {
    // Controlled motion.
    if(keys.ArrowUp) {
        ship.delta.x += Math.cos(ship.angle) * 0.1;
        ship.delta.y += Math.sin(ship.angle) * 0.1;
    }
    if(keys.ArrowLeft) {
        ship.deltaAngle -= 0.001;
    }
    if(keys.ArrowRight) {
        ship.deltaAngle += 0.001;
    }
    
    // Indirect effects.
    ship.pos.x += ship.delta.x;
    ship.pos.y += ship.delta.y;
    ship.angle += ship.deltaAngle;
    ship.delta.x *= 0.995;
    ship.delta.y *= 0.995;
    ship.deltaAngle *= 0.995;            
    ship.displayAngle = ship.angle;
}

export function oldSchoolDrag(ship) {
    if(keys.ArrowUp) {
        ship.delta.x += Math.cos(ship.angle) * 0.5;
        ship.delta.y += Math.sin(ship.angle) * 0.5;
    }
    if(keys.ArrowLeft) {
        ship.deltaAngle -= 0.01;
    }
    if(keys.ArrowRight) {
        ship.deltaAngle += 0.01;
    }

    ship.pos.x += ship.delta.x;
    ship.pos.y += ship.delta.y;
    ship.angle += ship.deltaAngle;
    ship.delta.x *= 0.95;
    ship.delta.y *= 0.95;
    ship.deltaAngle *= 0.9;
    ship.displayAngle = ship.angle;
}

export function speedster(ship) {
    if(keys.ArrowUp) {
        ship.speed += 0.02;
    }
    if(keys.ArrowLeft) {
        ship.deltaAngle -= 0.01;
    }
    if(keys.ArrowRight) {
        ship.deltaAngle += 0.01;
    }

    ship.speed *= 0.99;
    ship.deltaAngle *= 0.9;
    ship.angle += ship.deltaAngle;
    ship.delta.x += Math.cos(ship.angle) * ship.speed;
    ship.delta.y += Math.sin(ship.angle) * ship.speed;
    ship.delta.x *= 0.95;
    ship.delta.y *= 0.95;
    ship.pos.x += ship.delta.x;
    ship.pos.y += ship.delta.y;
    ship.displayAngle = ship.angle;
}

export function engineRev(ship) {  // ship one has a 3 control. Engine speed then affects acceleration. 
    if(keys.ArrowUp) {
        ship.engSpeed = 3
    }else{
        ship.engSpeed *= 0.9;
    }
    if(keys.ArrowLeft) {
        ship.angle -= 0.1;
    }
    if(keys.ArrowRight) {
        ship.angle += 0.1;
    }

    ship.engSpeedC += (ship.engSpeed- ship.engSpeedR) * 0.05;
    ship.engSpeedC *= 0.1;
    ship.engSpeedR += ship.engSpeedC;
    ship.speedC += (ship.engSpeedR - ship.speedR) * 0.1;
    ship.speedC *= 0.4;
    ship.speedR += ship.speedC;
    ship.angleC += (ship.angle - ship.angleR) * 0.1;
    ship.angleC *= 0.4;
    ship.angleR += ship.angleC;
    ship.delta.x += Math.cos(ship.angleR) * ship.speedR * 0.1; // 0.1 reducing ship as easier to manage speeds when values near pixel size and not 0.00umpteen0001
    ship.delta.y += Math.sin(ship.angleR) * ship.speedR * 0.1;
    ship.delta.x *= 0.99;
    ship.delta.y *= 0.99;
    ship.pos.x += ship.delta.x;
    ship.pos.y += ship.delta.y;
    ship.displayAngle = ship.angleR;
}

export function speedLimiter(ship) {
    if(keys.ArrowUp) {
        ship.speed = 15;
    }else{
        ship.speed = 0;
    }
    if(keys.ArrowLeft) {
        ship.angle -= 0.1;
    }
    if(keys.ArrowRight) {
        ship.angle += 0.1;
    }

    ship.speedC += (ship.speed - ship.speedR) * 0.1;
    ship.speedC *= 0.4;
    ship.speedR += ship.speedC;
    ship.angleC += (ship.angle - ship.angleR) * 0.1;
    ship.angleC *= 0.4;
    ship.angleR += ship.angleC;
    ship.delta.x = Math.cos(ship.angleR) * ship.speedR;
    ship.delta.y = Math.sin(ship.angleR) * ship.speedR;
    ship.pos.x += ship.delta.x;
    ship.pos.y += ship.delta.y;
    ship.displayAngle = ship.angleR;
}

export const AVAILABLE = {
    "oldSchool": oldSchool, 
    "oldSchoolDrag": oldSchoolDrag, 
    "speedster": speedster, 
    "engineRev": engineRev, 
    "speedLimiter": speedLimiter
};

export function controlSchemeLoader(controlScheme) {
    if (controlScheme in AVAILABLE) {
        console.log("control scheme EXISTS", controlScheme);
        return AVAILABLE[controlScheme];
    } else {
        console.error("control scheme NOT EXIST", controlScheme);
        return null;
    }
}