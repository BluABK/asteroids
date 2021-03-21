import {keys} from "./keys.mjs";

export const ship = {
    element : null,
    speed : 0,
    speedC : 0,  // chase value for speed limit mode
    speedR : 0,  // real value (real as in actual speed)
    angle : 0,
    angleC : 0,  // as above
    angleR : 0,
    engSpeed : 0,
    engSpeedC : 0,
    engSpeedR : 0,
    displayAngle : 0, // the display angle
    deltaAngle : 0,
    matrix : null,  // matrix to create when instantiated 
    pos : null,     // position of ship to create when instantiated 
    delta : null,   // movement of ship to create when instantiated 
    checkInView() {
        var bounds = this.element.getBoundingClientRect();
        if (Math.max(bounds.right,bounds.left) < 0 && this.delta.x < 0) {
            this.pos.x = innerWidth;
        } else if(Math.min(bounds.right,bounds.left) > innerWidth  && this.delta.x > 0) {
            this.pos.x = 0;
        }
        if (Math.max(bounds.top,bounds.bottom) < 0  && this.delta.y < 0) {
            this.pos.y = innerHeight;
        } else if ( Math.min(bounds.top,bounds.bottom) > innerHeight  && this.delta.y > 0) {
            this.pos.y = 0;
        }
        
    },
    controls : {
        oldSchool() {
            // Controlled motion.
            if(keys.ArrowUp) {
                this.delta.x += Math.cos(this.angle) * 0.1;
                this.delta.y += Math.sin(this.angle) * 0.1;
            }
            if(keys.ArrowLeft) {
                this.deltaAngle -= 0.001;
            }
            if(keys.ArrowRight) {
                this.deltaAngle += 0.001;
            }
            
            // Indirect effects.
            this.pos.x += this.delta.x;
            this.pos.y += this.delta.y;
            this.angle += this.deltaAngle;
            this.displayAngle = this.angle;
            this.delta.x *= 0.995;
            this.delta.y *= 0.995;
            this.deltaAngle *= 0.995;            
        },
        oldSchoolDrag() {
            if(keys.ArrowUp) {
                this.delta.x += Math.cos(this.angle) * 0.5;
                this.delta.y += Math.sin(this.angle) * 0.5;
            }
            if(keys.ArrowLeft) {
                this.deltaAngle -= 0.01;
            }
            if(keys.ArrowRight) {
                this.deltaAngle += 0.01;
            }

            this.pos.x += this.delta.x;
            this.pos.y += this.delta.y;
            this.angle += this.deltaAngle;
            this.delta.x *= 0.95;
            this.delta.y *= 0.95;
            this.deltaAngle *= 0.9;
            this.displayAngle = this.angle;
        },
        speedster() {
            if(keys.ArrowUp) {
                this.speed += 0.02;
            }
            if(keys.ArrowLeft) {
                this.deltaAngle -= 0.01;
            }
            if(keys.ArrowRight) {
                this.deltaAngle += 0.01;
            }

            this.speed *= 0.99;
            this.deltaAngle *= 0.9;
            this.angle += this.deltaAngle;
            this.delta.x += Math.cos(this.angle) * this.speed;
            this.delta.y += Math.sin(this.angle) * this.speed;
            this.delta.x *= 0.95;
            this.delta.y *= 0.95;
            this.pos.x += this.delta.x;
            this.pos.y += this.delta.y;
            this.displayAngle = this.angle;
        },
        engineRev() {  // this one has a 3 control. Engine speed then affects acceleration. 
            if(keys.ArrowUp) {
                this.engSpeed = 3
            }else{
                this.engSpeed *= 0.9;
            }
            if(keys.ArrowLeft) {
                this.angle -= 0.1;
            }
            if(keys.ArrowRight) {
                this.angle += 0.1;
            }

            this.engSpeedC += (this.engSpeed- this.engSpeedR) * 0.05;
            this.engSpeedC *= 0.1;
            this.engSpeedR += this.engSpeedC;
            this.speedC += (this.engSpeedR - this.speedR) * 0.1;
            this.speedC *= 0.4;
            this.speedR += this.speedC;
            this.angleC += (this.angle - this.angleR) * 0.1;
            this.angleC *= 0.4;
            this.angleR += this.angleC;
            this.delta.x += Math.cos(this.angleR) * this.speedR * 0.1; // 0.1 reducing this as easier to manage speeds when values near pixel size and not 0.00umpteen0001
            this.delta.y += Math.sin(this.angleR) * this.speedR * 0.1;
            this.delta.x *= 0.99;
            this.delta.y *= 0.99;
            this.pos.x += this.delta.x;
            this.pos.y += this.delta.y;
            this.displayAngle = this.angleR;
        },
        speedLimiter() {
            if(keys.ArrowUp) {
                this.speed = 15;
            }else{
                this.speed = 0;
            }
            if(keys.ArrowLeft) {
                this.angle -= 0.1;
            }
            if(keys.ArrowRight) {
                this.angle += 0.1;
            }

            this.speedC += (this.speed - this.speedR) * 0.1;
            this.speedC *= 0.4;
            this.speedR += this.speedC;
            this.angleC += (this.angle - this.angleR) * 0.1;
            this.angleC *= 0.4;
            this.angleR += this.angleC;
            this.delta.x = Math.cos(this.angleR) * this.speedR;
            this.delta.y = Math.sin(this.angleR) * this.speedR;
            this.pos.x += this.delta.x;
            this.pos.y += this.delta.y;
            this.displayAngle = this.angleR;
        }
    },
    updateUserIO() {
    },
    updatePos() {
        this.checkInView();
        var m = this.matrix;
        m[3] = m[0] = Math.cos(this.displayAngle);
        m[2] = -(m[1] = Math.sin(this.displayAngle));
        m[4] = this.pos.x;
        m[5] = this.pos.y;
        this.element.style.transform = `matrix(${m.join(",")})`;
    },
    /**
     * Create new spaceship.
     * 
     * @param shape Shape of the spaceship.
     * @param container Which element to append it to.
     * @param xOff X-Axis offset.
     * @param yourRide Ship model controls to map it to (must be one of: oldSchool, oldSchoolDrag, speedster, engineRev or speedLimiter).
     * @returns created spaceship element.
     */
    create(shape, container, xOff, yourRide) { // FIXME: change code to take SVG element as shape arg?
        this.element = document.createElement("div")
        this.element.style.position = "absolute";
        this.element.style.top = this.element.style.left = "0px";
        this.element.style.fontSize = "24px";
        this.element.textContent = shape;
        this.element.style.color  = "green";
        this.element.style.zIndex  = 100;

        // // Create a new element in the SVG namespace.
        // this.element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        // this.element.setAttributeNS(null, "id", "spaceship");
        // this.element.setAttributeNS(null, "points", "15,0 4,30 26,30");

        container.appendChild(this.element);
        this.matrix = [1,0,0,1,0,0];
        this.pos = { x : innerWidth / 2 + innerWidth * xOff, y : innerHeight / 2 };
        this.delta = { x : 0, y : 0};
        this.updateUserIO = this.controls[yourRide];

        // Return the newly created spaceship element.
        return this;
    }
}