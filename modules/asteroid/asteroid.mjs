export const asteroid = {
    element : null,
    scale: 1,
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
    move(deltaX = 0, deltaY = 0, deltaAngle = 0) {
        this.delta.x += Math.cos(this.angle) * deltaX;
        this.delta.y += Math.sin(this.angle) * deltaY;
        this.deltaAngle += deltaAngle;
    },
    updateMovement() {
        // Indirect effects.
        this.pos.x += this.delta.x;
        this.pos.y += this.delta.y;
        this.angle += this.deltaAngle;
        this.delta.x *= 0.995;
        this.delta.y *= 0.995;
        // this.deltaAngle *= 0.995;            
        this.displayAngle = this.angle;
    },
    updatePos() {
        this.checkInView();
        var m = this.matrix;
        m[3] = m[0] = Math.cos(this.displayAngle);
        m[2] = -(m[1] = Math.sin(this.displayAngle));
        m[4] = this.pos.x;
        m[5] = this.pos.y;

        this.element.style.transform = `matrix(${m.join(",")}) scale(${this.scale})`;
    },
    /**
     * Create new spaceship.
     * 
     * @param {HTMLElement} shape Shape of the spaceship.
     * @param spawnOffset X, Y offset to spawn at.
     * @param {float} spawnOffset.x X-Axis offset multiplier.
     * @param {float} spawnOffset.y Y-Axis offset multiplier.
     * @param {string} controlScheme {string} Ship model controls to map it to (must be one of: oldSchool, oldSchoolDrag, speedster, engineRev or speedLimiter).
     * @returns {object} The created spaceship element.
     */
    create(shape, scale, spawnOffset = null) {
        if (spawnOffset == null) {
            spawnOffset = {x: 1.0, y: 1.0}
        }

        this.element = shape;

        // CSS Transform matrix
        this.scale = scale;
        this.matrix = [1,0,0,1,0,0];
        this.pos = { x : (innerWidth / 2) * spawnOffset.x, y : (innerHeight / 2) * spawnOffset.y};
        this.delta = { x : 0, y : 0};

        // Return the newly created asteroid element.
        return this;
    }
}