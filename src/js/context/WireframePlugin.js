/**
 * Manages state of wireframe preview.
 */
class WireframePlugin {

  /**
   * WireframePlugin class constructor.
   */
  constructor() { }

  /**
   * Flips the current wireframe state.
   *
   * @param objects {Array<THREE.Mesh | THREE.Group>} 3.js scene objects
   */
  toggleState(objects) {

    /* Updates wireframe of all the objects in the scene */
    objects.map((node) => {
      if (node instanceof THREE.Mesh)
        node.material.wireframe = !node.material.wireframe
      else
        this.toggleState(node.children)
    })

  }

}
