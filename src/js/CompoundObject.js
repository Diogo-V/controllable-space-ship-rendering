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
   * @return {Mesh}
   */
  getPrimary() { return this.#primary }

  /**
   * Gets secondary object.
   *
   * @return {Mesh}
   */
  getSecondary() { return this.#secondary }

  /**
   * Gets scene group.
   *
   * @return {Group}
   */
  getGroup() { return this.#group }

  /**
   * Applies a rotation to our primary object.
   *
   * @param radius {number} world radius
   * @param theta {number} theta angle
   * @param phi {number} phi angle
   *
   * @return number[] -> [x, y, z]
   */
  #applyRotation(radius, theta, phi) {
    return [
      Math.sin(phi) * radius * Math.sin(theta) - this.getPrimary().position.x,
      Math.cos(phi) * radius - this.getPrimary().position.y,
      Math.sin(phi) * radius * Math.cos(theta) - this.getPrimary().position.z
    ]
  }

  /**
   * Moves articulated object in input direction by changing the position values of the group.
   *
   * @param directions {Array<Direction>}
   * @param delta {number}
   * @param radius {number} world radius
   */
  move(directions, delta, radius) {

    /* Calculates theta and phi so that we can rotate the spaceship */
    let {x, y, z} = this.getPrimary().position
    let theta = Math.atan2(x, z)
    let phi = Math.acos(Math.max(-1, Math.min(1, y / radius)))

    /* Calculates new x, z, y values based on the rotation of the spaceship */
    let totalMovementVector = new THREE.Vector3(0, 0, 0)
    directions.forEach((direction) => {
      switch (direction) {
        case Direction.UP:
          totalMovementVector.add(new THREE.Vector3(...this.#applyRotation(radius, theta, phi - _MOVE_STEP * delta)))
          break
        case Direction.DOWN:
          totalMovementVector.add(new THREE.Vector3(...this.#applyRotation(radius, theta, phi + _MOVE_STEP * delta)))
          break
        case Direction.LEFT:
          totalMovementVector.add(new THREE.Vector3(...this.#applyRotation(radius, theta - _MOVE_STEP * delta, phi)))
          break
        case Direction.RIGHT:
          totalMovementVector.add(new THREE.Vector3(...this.#applyRotation(radius, theta + _MOVE_STEP * delta, phi)))
          break
      }
    })

    /* Applies rotation values */
    this.getPrimary().position.add(totalMovementVector.normalize())

  }

}

const _MOVE_STEP = 2
