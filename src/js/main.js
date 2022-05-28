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

    //Curved Tube
    class CustomSinCurve extends THREE.Curve {
      constructor(scale) {
        super()
        this.scale = scale
      }
      getPoint(t) {
        const tx = t * 7.5 - 1.5
        const ty = Math.sin(2 * Math.PI * t)
        const tz = 0
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale)
      }
    }

    // Left "S"
    let path = new CustomSinCurve(10)
    let tubularSegments = 20  // ui: tubularSegments
    let radius = 1  // ui: radius
    let radialSegments = 8  // ui: radialSegments
    let closed = false  // ui: closed
    let geometry = new THREE.TubeGeometry(
      path, tubularSegments, radius, radialSegments, closed)
    let material = new THREE.MeshBasicMaterial( { color: 0x40ffef } )
    let tube = new THREE.Mesh( geometry, material )
    tube.position.x = -95
    tube.position.y = 65
    tube.position.z = -25
    scene.add(tube)
    this.#sceneObjects.push(tube)

    // Big Central Donut *
    radius = 90  // ui: radius
    let tubeRadius = 1  // ui: tubeRadius
    radialSegments = 16  // ui: radialSegments
    tubularSegments = 40  // ui: tubularSegments
    geometry = new THREE.TorusGeometry(
      radius, tubeRadius,
      radialSegments, tubularSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xffff00 } )
    let torus = new THREE.Mesh( geometry, material )
    torus.position.x = 0
    torus.position.y = 0
    torus.position.z = 0
    scene.add(torus)
    this.#sceneObjects.push(torus)

    // Big Central Pyramid
    radius = 40  // ui: radius
    let height = 105  // ui: height
    radialSegments = 4  // ui: radialSegments
    geometry = new THREE.ConeGeometry(radius, height, radialSegments)
    material = new THREE.MeshBasicMaterial( { color: 0x03fc20 } )
    let pyramid = new THREE.Mesh( geometry, material )
    pyramid.position.x = 0
    pyramid.position.y = 0
    pyramid.position.z = -140
    scene.add(pyramid)
    this.#sceneObjects.push(pyramid)

    // Big Front Cube *
    let width = 50  // ui: width
    height = 50  // ui: height
    let depth = 50  // ui: depth
    let widthSegments = 4  // ui: widthSegments
    let heightSegments = 4 // ui: heightSegments
    let depthSegments = 4  // ui: depthSegments
    geometry = new THREE.BoxGeometry(
      width, height, depth,
      widthSegments, heightSegments, depthSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc3d03 } )
    let cube = new THREE.Mesh( geometry, material )
    cube.position.x = 51.5
    cube.position.y = -75
    cube.position.z = 75
    scene.add(cube)
    this.#sceneObjects.push(cube)

    // Saturn *
    radius = 24  // ui: radius
    widthSegments = 12  // ui: widthSegments
    heightSegments = 8  // ui: heightSegments
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xf1c681 } )
    let saturn = new THREE.Mesh( geometry, material )
    saturn.position.x = -90
    saturn.position.y = -50
    saturn.position.z = 35
    scene.add(saturn)
    this.#sceneObjects.push(saturn)

    radius = 26  // ui: radius
    tubeRadius = 1  // ui: tubeRadius
    radialSegments = 16  // ui: radialSegments
    tubularSegments = 24  // ui: tubularSegments
    geometry = new THREE.TorusGeometry(
      radius, tubeRadius,
      radialSegments, tubularSegments)
    material = new THREE.MeshBasicMaterial( { color: 0x94846c } )
    torus = new THREE.Mesh( geometry, material )
    torus.position.x = -90
    torus.position.y = -50
    torus.position.z = 35
    torus.rotation.x = Math.PI / 2
    scene.add(torus)
    this.#sceneObjects.push(torus)

    // Right Side Ball *
    radius = 15  // ui: radius
    widthSegments = 12  // ui: widthSegments
    heightSegments = 8  // ui: heightSegments
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc03fc } )
    let ball = new THREE.Mesh( geometry, material )
    ball.position.x = 125
    ball.position.y = 10
    ball.position.z = 60
    scene.add(ball)
    this.#sceneObjects.push(ball)

    // Central Ball *
    radius = 5  // ui: radius
    widthSegments = 12  // ui: widthSegments
    heightSegments = 8 // ui: heightSegments
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xbc40ff } )
    ball = new THREE.Mesh( geometry, material )
    ball.position.x = 30
    ball.position.y = 70
    ball.position.z = -180
    scene.add(ball)
    this.#sceneObjects.push(ball)

    // Right Side Octahedron *
    radius = 10  // ui: radius
    geometry = new THREE.OctahedronGeometry(radius)
    material = new THREE.MeshBasicMaterial( { color: 0x3d03fc } )
    let octahedron = new THREE.Mesh( geometry, material )
    octahedron.position.x = 70
    octahedron.position.y = 50
    octahedron.position.z = -85
    scene.add(octahedron)
    this.#sceneObjects.push(octahedron)

    // Triangular Prism
    let radiusTop = 10  // ui: radiusTop
    let radiusBottom = 10 // ui: radiusBottom
    height = 6  // ui: height
    radialSegments = 3  // ui: radialSegments
    geometry = new THREE.CylinderGeometry(
      radiusTop, radiusBottom, height, radialSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xff7340 } )
    let prism = new THREE.Mesh( geometry, material )
    prism.position.x = -115
    prism.position.y = 85
    prism.position.z = 85
    prism.rotation.x = Math.PI / 6
    prism.rotation.z = Math.PI / 2
    scene.add(prism)
    this.#sceneObjects.push(prism)

    // Small Right Side Torus *
    radius = 10 // ui: radius
    tubeRadius = 2.5  // ui: tubeRadius
    radialSegments = 16  // ui: radialSegments
    tubularSegments = 24  // ui: tubularSegments
    geometry = new THREE.TorusGeometry(
      radius, tubeRadius,
      radialSegments, tubularSegments)
    material = new THREE.MeshBasicMaterial( { color: 0x94846c } )
    torus = new THREE.Mesh( geometry, material )
    torus.position.x= 80
    torus.position.y= -27.5
    torus.position.z= -15
    torus.rotation.x = Math.PI / 2
    scene.add(torus)
    this.#sceneObjects.push(torus)

    // TODO: start -> THREE OBJECTS TO MOVE

    // Cone
    radius = 5  // ui: radius
    height = 10  // ui: height
    radialSegments = 30  // ui: radialSegments
    geometry = new THREE.ConeGeometry(radius, height, radialSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc03e3 } )
    let cone = new THREE.Mesh( geometry, material )
    cone.position.x = 0
    cone.position.y = 0
    cone.position.z = 0
    cone.rotation.x = Math.PI

    let cubesGroup = new THREE.Group()
    // Cube on Cube
    width = 4  // ui: width
    height = 4  // ui: height
    depth = 4  // ui: depth
    widthSegments = 5  // ui: widthSegments
    heightSegments = 5  // ui: heightSegments
    depthSegments = 5  // ui: depthSegments
    geometry = new THREE.BoxGeometry(
      width, height, depth,
      widthSegments, heightSegments, depthSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
    cube = new THREE.Mesh( geometry, material )
    cube.position.x = 0
    cube.position.y = -18
    cube.position.z = 0
    cubesGroup.add(cube)

    width = 20  // ui: width
    height = 4  // ui: height
    depth = 20 // ui: depth
    widthSegments = 3  // ui: widthSegments
    heightSegments = 3  // ui: heightSegments
    depthSegments = 3 // ui: depthSegments
    geometry = new THREE.BoxGeometry(
      width, height, depth,
      widthSegments, heightSegments, depthSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
    cube = new THREE.Mesh( geometry, material )
    cube.position.x = 0
    cube.position.y = -22
    cube.position.z = 0
    cubesGroup.add(cube)


    radius = 3  // ui: radius
    widthSegments = 12  // ui: widthSegments
    heightSegments = 8 // ui: heightSegments
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial( { color: 0xbc40ff } )
    ball = new THREE.Mesh( geometry, material )
    ball.position.x = -45
    ball.position.y = 0
    ball.position.z = 0

    scene.add(this.getCompound().getGroup())
    this.#sceneObjects.push(this.getCompound().getGroup())

    // Setting pivot point
    let pivotPoint1 = new THREE.Object3D();
    pivotPoint1.position.set(0,0,-45);
    pivotPoint1.add(cone);
    this.getCompound().setPrimary(pivotPoint1);

    let pivotPoint2 = new THREE.Object3D();
    pivotPoint2.position.set(0,0,0);
    pivotPoint2.add(cubesGroup);
    this.getCompound().setSecondary(pivotPoint2);

    let pivotPoint3 = new THREE.Object3D();
    pivotPoint3.position.set(0,-20,0);
    pivotPoint3.add(ball);
    this.getCompound().setTertiary(pivotPoint3);


    // TODO: end -> objects to move

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
