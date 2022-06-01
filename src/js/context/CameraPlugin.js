/**
 * Manages and instantiates cameras in the scene.
 */
class CameraPlugin {

  /**
   * Holds current camera being used in the scene.
   */
  #currentCamera

  /**
   * Three.js camera that has a front view in the current scene.
   */
  #front

  /**
   * Three.js camera that follows the spaceship in the current scene.
   */
  #follow

  /**
   * Three.js camera that has a side view in the current scene.
   */
  #side

  /**
   * CameraPlugin class constructor. We set the frontal camera as the default one.
   */
  constructor(scene, followCamera) {
    this.#buildFrontCamera(scene)
    this.#buildFollowCamera(followCamera)
    this.#buildSideCamera(scene)
    this.#currentCamera = this.#front
  }

  /**
   * Builds Three.js camera with a front view of the scene.
   */
  #buildFrontCamera(scene) {
    let camera = new THREE.OrthographicCamera(window.innerWidth / -__SHIFT_FRONTAL, window.innerWidth / __SHIFT_FRONTAL,
      window.innerHeight / __SHIFT_FRONTAL, window.innerHeight / -__SHIFT_FRONTAL)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 300
    camera.lookAt(scene.position)
    this.#front = camera
  }

  /**
   * Builds Three.js camera with a follow view of the spaceship.
   */
  #buildFollowCamera(camera) {
    this.#follow = camera
  }

  /**
   * Builds Three.js camera with a side view of the scene.
   */
  #buildSideCamera(scene) {
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.x = 300
    camera.position.y = 0
    camera.position.z = 0
    camera.lookAt(scene.position)
    this.#side = camera
  }

  /**
   * Returns the current camera being used.
   *
   * @return {THREE.Camera} camera being used in the scene
   */
  getCurrentCamera() {
    return this.#currentCamera
  }

  /**
   * Updates currently being used camera.
   *
   * @param newCameraType type of the new camera to be used in the scene
   */
  setCamera(newCameraType) {
    switch (newCameraType) {
      case __FRONTAL:
        this.#currentCamera = this.#front
        break
      case __FOLLOW:
        this.#currentCamera = this.#follow
        break
      case __SIDE:
        this.#currentCamera = this.#side
    }
  }

  /**
   * Gets frontal const value. Is mainly used to change the type of camera being used in the scene.
   *
   * @returns {number} frontal const value
   */
  static get FRONTAL() {
    return __FRONTAL
  }

  /**
   * Gets follow const value. Is mainly used to change the type of camera being used in the scene.
   *
   * @returns {number} follow const value
   */
  static get FOLLOW() {
    return __FOLLOW
  }

  /**
   * Gets side const value. Is mainly used to change the type of camera being used in the scene.
   *
   * @returns {number} side const value
   */
  static get SIDE() {
    return __SIDE
  }

}


/* Holds type of camera that can be instantiated (front, top and side view) */
const __FRONTAL = 0, __FOLLOW = 1, __SIDE = 2
const __SHIFT_FRONTAL = 7
const __SHIFT_FOLLOW = 4
