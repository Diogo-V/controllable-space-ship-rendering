/**
 * Describes scene's plugin's context. Also helps manage them.
 */
class ContextManagementEngine {

  /**
   * Holds camera plugin. This camera plugin will manage the cameras state and switch between them.
   */
  #camera

  /**
   * ContextManagementEngine class constructor.
   */
  constructor(scene) {
    this.#camera = new CameraPlugin(scene)
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

}
