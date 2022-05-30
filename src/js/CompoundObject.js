class CompoundObject {

  /**
   * Holds main object of this composition.
   */
  #primary

  /**
   * Holds secondary object of this composition.
   */
  #secondary

  /**
   * Three.js group object that is going to be added to the scene.
   */
  #group

  /**
   * CompoundObject class constructor.
   */
  constructor() {
    this.#group = new THREE.Group()
  }

  /**
   * Sets primary object.
   *
   * @param primary {THREE.Mesh}
   */
  setPrimary(primary) {
    this.getGroup().add(primary)
    this.#primary = primary
  }

  /**
   * Sets secondary object.
   *
   * @param secondary {THREE.Mesh}
   */
  setSecondary(secondary) {
    this.getGroup().add(secondary)
    this.getPrimary().add(secondary)
    this.#secondary = secondary
  }

  /**
   * Gets primary object.
   *
   * @return {THREE.Mesh}
   */
  getPrimary() { return this.#primary }

  /**
   * Gets secondary object.
   *
   * @return {THREE.Mesh}
   */
  getSecondary() { return this.#secondary }

  /**
   * Gets scene group.
   *
   * @return {THREE.Group}
   */
  getGroup() { return this.#group }

  /**
   * Applies a rotation to our primary object.
   *
   * @param radius {number} world radius
   * @param theta {number} theta angle
   * @param phi {number} phi angle
   */
  #applyRotation(radius, theta, phi) {
    this.getPrimary().position.x = Math.sin(phi) * radius * Math.sin(theta)
    console.log("X: ", Math.sin(phi) * radius * Math.sin(theta))
    this.getPrimary().position.z = Math.sin(phi) * radius * Math.cos(theta)
    console.log("Y: ", Math.sin(phi) * radius * Math.cos(theta))
    this.getPrimary().position.y = Math.cos(phi) * radius
    console.log("Z: ", Math.cos(phi) * radius)
  }

  /**
   * Moves articulated object in input direction by changing the position values of the group.
   *
   * @param direction {Direction}
   * @param delta {number}
   * @param radius {number} world radius
   */
  move(direction, delta, radius) {

    /* Calculates theta and phi so that we can rotate the spaceship */
    let {x, y, z} = this.getPrimary().position
    let theta = Math.atan2(x, z)
    let phi = Math.acos(Math.max(-1, Math.min(1, y / radius)))
    
    switch (direction) {
      case Direction.UP:
        this.#applyRotation(radius, theta, phi + _MOVE_STEP * delta)
        break
      case Direction.DOWN:
        this.#applyRotation(radius, theta, phi - _MOVE_STEP * delta)
        break
      case Direction.LEFT:
        this.#applyRotation(radius, theta + _MOVE_STEP * delta, phi)
        break
      case Direction.RIGHT:
        this.#applyRotation(radius, theta - _MOVE_STEP * delta, phi)
        break
    }
  }

}

const _MOVE_STEP = 3
