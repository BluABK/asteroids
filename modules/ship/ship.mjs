import {keys} from "../keys.mjs";
// import * as controlSchemes from "./controls.mjs";
import {AVAILABLE, controlSchemeLoader} from "./controls.mjs";

export const ship = {
    element : null,
    controls: null,
    customControls: null,
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
    defaultControls() {
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
        this.delta.x *= 0.995;
        this.delta.y *= 0.995;
        this.deltaAngle *= 0.995;            
        this.displayAngle = this.angle;
    },
    /**
     * Empty function to be replaced by a control scheme.
     */
    updateUserIO() {
        this.controls(this);
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
     * @param controlScheme Ship model controls to map it to (must be one of: oldSchool, oldSchoolDrag, speedster, engineRev or speedLimiter).
     * @returns The created spaceship element.
     */
    create(shape, container, xOff, customControlScheme = null) { // FIXME: change code to take SVG element as shape arg?
        // Create a new element in the SVG namespace.
        // this.element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        this.element.setAttributeNS(null, "id", "spaceship");
        this.element.setAttributeNS(null, "points", "5,10 0,20 30,10 0,0");

        // this.element = document.createElement("div")
        this.element.style.position = "absolute";
        this.element.style.top = this.element.style.left = "0px";
        // this.element.style.fontSize = "24px";
        // this.element.textContent = shape;
        // this.element.style.color  = "green";
        this.element.style.zIndex  = 100;


        container.appendChild(this.element);
        this.matrix = [1,0,0,1,0,0];
        this.pos = { x : innerWidth / 2 + innerWidth * xOff, y : innerHeight / 2 };
        this.delta = { x : 0, y : 0};
        
        // Set custom control scheme if supplied, else use own default.
        console.log("customControlScheme", customControlScheme);

        let scheme = controlSchemeLoader(customControlScheme);
        scheme !== null ? this.controls = scheme : this.updateUserIO = this.defaultControls;

        // Return the newly created spaceship element.
        return this;
    }
}