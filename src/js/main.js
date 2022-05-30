class Main {

  /**
   * Holds scene (where all the components are going to be put).
   */
  #scene

  /**
   * Holds context object that allows us to control simple plugins (camera, wireframe, ...) that influence the state of
   * the scene.
   */
  #context

  /**
   * Component that will render 3.js objects in our scene (we set this to the max size of the screen).
   */
  #renderer

  /**
   * Plugin that will control the key pressing.
   */
  #controller

  /**
   * Holds articulated object.
   */
  #compound

  /**
   * Holds clock value and determines delta time. This allows for pcs with lower fps to still get a good image.
   */
  #clock

  /**
   * Holds all the objects that were added to the scene.
   * 
   * @type {Array<THREE.Mesh>}
   */
  #sceneObjects

  /**
   * Main class constructor.
   */
  constructor() {

    /* Builds components required to manage, control and display our scene */
    this.#renderer = Main.#initRenderer()
    this.#sceneObjects = Array()
    this.#compound = new CompoundObject()
    this.#scene = this.#initScene()
    this.#context = new ContextManagementEngine(this.getScene())
    this.#controller = new KeyController()
    this.#clock = new THREE.Clock(true)

    /* Renders everything in the UI */
    this.#display()

    /* Adds key handling method to the program. This will, latter on, allow us to rotate and change camera perspective
     * after a user input a key */
    window.addEventListener("keydown", function(event) {
      this.getController().onKeyPress(event)
    }.bind(this), false)

    /* Clears pressed keys when the user stops clicking it */
    window.addEventListener("keyup", function (event) {
     this.getController().onKeyUp(event)
    }.bind(this), false)

  }

  /**
   * Creates scene and adds objects to it.
   */
  #initScene() {
    'use strict'

    /* Creates scene  */
    let scene = new THREE.Scene()

    /* Adds rest of objects to the scene */
    this.#buildScene(scene)

    return scene
  }

  /**
   * Initializes component that will render 3.js objects in our scene.
   *
   * @return {THREE.WebGLRenderer}
   */
  static #initRenderer() {
    'use strict'

    /*  (we set this to the max size of the screen) */
    let renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    return renderer
  }

  /**
   * Returns scene object (holds all other objects in the screen).
   *
   * @return {THREE.Scene}
   */
  getScene() { return this.#scene }

  /**
   * Returns compound object.
   *
   * @return {CompoundObject}
   */
  getCompound() { return this.#compound }

  /**
   * Returns context.
   *
   * @return {ContextManagementEngine}
   */
  getContext() { return this.#context }

  /**
   * Returns WebGL renderer.
   *
   * @return {THREE.WebGLRenderer}
   */
  getRenderer() { return this.#renderer }

  /**
   * Returns a list with the objects added to the scene.
   *
   * @return {Array<THREE.Mesh>}
   */
  getSceneObjects() { return this.#sceneObjects }

  /**
   * Returns three.js clock.
   *
   * @return {THREE.Clock}
   */
  getClock() { return this.#clock }

  /**
   * Returns key pressing controller.
   *
   * @return {KeyController}
   */
  getController() { return this.#controller }

  /**
   * Adds objects to the scene.
   */
  #buildScene = (scene) => {
    'use strict'

    let radius
    let geometry
    let material
    let widthSegments
    let heightSegments
    let ball
    let height
    let cube
    let depth
    let depthSegments
    let width
    let spaceshipBody
    let spaceshipHead

    // World
    radius = 70
    widthSegments = 32
    heightSegments = 32
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('./../../resources/textures/earth_base.jpg')
    })
    ball = new THREE.Mesh(geometry, material)
    ball.position.x = 0
    ball.position.y = 0
    ball.position.z = 0
    scene.add(ball)
    this.#sceneObjects.push(ball)

    // Orbital trash
    width = 4  // ui: width
    height = 4  // ui: height
    depth = 4  // ui: depth
    widthSegments = 5  // ui: widthSegments
    heightSegments = 5  // ui: heightSegments
    depthSegments = 5  // ui: depthSegments
    geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
    cube = new THREE.Mesh( geometry, material )
    cube.position.x = 0
    cube.position.y = -90
    cube.position.z = 0
    scene.add(cube)
    this.#sceneObjects.push(cube)

    // Spaceship
    geometry = new THREE.CylinderGeometry(5, 5, 20, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffff00})
    spaceshipBody = new THREE.Mesh(geometry, material)
    spaceshipBody.position.x = 120
    this.getCompound().setPrimary(spaceshipBody)

    geometry = new THREE.CylinderGeometry(2, 2, 8, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffff00})
    spaceshipHead = new THREE.Mesh(geometry, material)
    spaceshipHead.position.y = 14
    this.getCompound().setSecondary(spaceshipHead)

    scene.add(this.getCompound().getPrimary())
    this.#sceneObjects.push(this.getCompound().getGroup())

  }

  /**
   * Cleans previous scene from the UI and displays the new objects after they have been updated.
   */
  #display = () => {
    'use strict'
    this.getRenderer().render(this.getScene(), this.getContext().getCamera())
  }

  /**
   * Defines the update life-cycle event. In this function, we update the state/position of each object in the scene
   * before they get 'displayed' in the UI again.
   */
  #update = () => {

    /* Gets the elapsed time from the previous frame. This makes fps smoother in lower end pc's */
    let delta = this.getClock().getDelta()

    /* Prompts key controller to check which keys were pressed and to delegate actions to the various components */
    this.getController().processKeyPressed(this.getContext(), this.getSceneObjects(), this.getCompound(), delta)

  }

  /**
   * Main UI loop control function. Is executed 60 times per second to achieve 60 frames/s. We update and then display
   * all items in an infinite loop.
   */
  animate = () => {
    'use strict'

    /* Update + Display life cycle */
    this.#update()
    this.#display()

    /* Tells browser to call the animate function again after 1/60 seconds */
    requestAnimationFrame(this.animate)
  }

}
