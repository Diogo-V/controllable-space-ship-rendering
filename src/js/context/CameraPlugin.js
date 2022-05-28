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
   * Three.js camera that has a top view in the current scene.
   */
  #top

  /**
   * Three.js camera that has a side view in the current scene.
   */
  #side

  /**
   * CameraPlugin class constructor. We set the frontal camera as the default one.
   */
  constructor(scene) {
    this.#buildFrontCamera(scene)
    this.#buildTopCamera(scene)
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
   * Builds Three.js camera with a top view of the scene.
   */
  #buildTopCamera(scene) {
    let camera = new THREE.OrthographicCamera(window.innerWidth / -__SHIFT_TOP, window.innerWidth / __SHIFT_TOP,
      window.innerHeight / __SHIFT_TOP, window.innerHeight / -__SHIFT_TOP)
    camera.position.x = 0
    camera.position.y = 300
    camera.position.z = 0
    camera.lookAt(scene.position)
    this.#top = camera
  }

  /**
   * Builds Three.js camera with a side view of the scene.
   */
  #buildSideCamera(scene) {
    let camera = new THREE.OrthographicCamera(window.innerWidth / -__SHIFT_SIDE, window.innerWidth / __SHIFT_SIDE,
      window.innerHeight / __SHIFT_SIDE, window.innerHeight / -__SHIFT_SIDE)
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
      case __TOP:
        this.#currentCamera = this.#top
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
   * Gets top const value. Is mainly used to change the type of camera being used in the scene.
   *
   * @returns {number} top const value
   */
  static get TOP() {
    return __TOP
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
const __FRONTAL = 0, __TOP = 1, __SIDE = 2
const __SHIFT_FRONTAL = 7
const __SHIFT_TOP = 4
const __SHIFT_SIDE = 7
