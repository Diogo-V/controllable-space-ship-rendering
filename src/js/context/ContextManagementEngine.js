/**
 * Describes scene's plugin's context. Also helps manage them.
 */
class ContextManagementEngine {

  /**
   * Holds camera plugin. This camera plugin will manage the cameras state and switch between them.
   */
  #camera

  /**
   * Holds wireframe plugin. Toggles the preview of wireframes in all the created objects.
   */
  #wireframe

  /**
   * ContextManagementEngine class constructor.
   */
  constructor(scene) {
    this.#camera = new CameraPlugin(scene)
    this.#wireframe = new WireframePlugin()
  }

  /**
   * Gets currently being used camera in the scene.
   *
   * @return {THREE.Camera} camera
   */
  getCamera() {
    return this.#camera.getCurrentCamera()
  }

  /**
   * Updates currently being used camera.
   *
   * @param newCameraType type of the new camera
   */
  setCamera(newCameraType) {
    this.#camera.setCamera(newCameraType)
  }

  /**
   * Updates wireframe preview state.
   *
   * @param objects 3.js scene objects
   */
  toggleWireframe(objects) {
    this.#wireframe.toggleState(objects)
  }

}
