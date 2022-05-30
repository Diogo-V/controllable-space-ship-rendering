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
   * Moves articulated object in input direction by changing the position values of the group.
   *
   * @param direction {Direction}
   * @param delta {number}
   */
  move(direction, delta) {
    switch (direction) {
      case Direction.UP:
        this.getGroup().position.y += __MOVE_STEP * delta
        break
      case Direction.DOWN:
        this.getGroup().position.y -= __MOVE_STEP * delta
        break
      case Direction.LEFT:
        this.getGroup().position.x -= __MOVE_STEP * delta
        break
      case Direction.RIGHT:
        this.getGroup().position.x += __MOVE_STEP * delta
        break
    }
  }

}

const __MOVE_STEP = 20
