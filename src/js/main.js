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
   * Holds spaceship.
   */
  #compound

  /**
   * Holds litter.
   */
  #litter

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
    this.#litter = Array()
    this.#compound = new CompoundObject()
    let [scene, followCamera]  = this.#initScene()
    this.#scene = scene
    this.#context = new ContextManagementEngine(this.getScene(), followCamera)
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

    let followCamera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000)

    /* Adds rest of objects to the scene */
    this.#buildScene(scene, followCamera)

    return [scene, followCamera]
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
  #buildScene = (scene, followCamera) => {
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
    radius = _EARTH_RADIUS
    widthSegments = 32
    heightSegments = 32
    geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
    material = new THREE.MeshBasicMaterial({color: 0xfffff})
    ball = new THREE.Mesh(geometry, material)
    ball.position.x = 0
    ball.position.y = 0
    ball.position.z = 0
    scene.add(ball)
    this.#sceneObjects.push(ball)

    // Orbital trash
    let min
    let max
    let size
    let x
    let y
    let z
    let pos
    let radialSegments

    //Cubes
    for (var i= 0 ;i<5;i+=1) {
      min = Math.ceil(_EARTH_RADIUS/24);
      max = Math.floor(_EARTH_RADIUS/20);
      size = Math.floor(Math.random() * (max - min)) + min

      width = size  // ui: width
      height = size  // ui: height
      depth = size  // ui: depth
      widthSegments = 5  // ui: widthSegments
      heightSegments = 5  // ui: heightSegments
      depthSegments = 5  // ui: depthSegments
      geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
      material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
      cube = new THREE.Mesh( geometry, material )

      min = Math.ceil(_EARTH_RADIUS*1.2)
      max = Math.floor(-(_EARTH_RADIUS*1.2))
      x = Math.floor(Math.random() * (max - min)) + min
      y = Math.floor(Math.random() * (max - min)) + min
      pos = Math.random()
      if (pos >= 0.5)
        z = Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)
      else
        z = -Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)

      cube.position.x = x
      cube.position.y = y
      cube.position.z = z
      cube.raioCol = (Math.sqrt(3)/2)*size
      scene.add(cube)
      this.#sceneObjects.push(cube)
      this.#litter.push(cube);
    }

    //Cylinders
    for (var i= 0 ;i<5;i+=1) {
      min = Math.ceil(_EARTH_RADIUS/24);
      max = Math.floor(_EARTH_RADIUS/20);
      height = Math.floor(Math.random() * (max - min)) + min
      radius = Math.floor(Math.random() * (max - min)) + min
      radius = radius/2

      radialSegments = 30  // ui: depthSegments
      geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments)
      material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
      cube = new THREE.Mesh( geometry, material )
      cube.raioCol = Math.sqrt((radius**2) + ((height/2)**2))

      min = Math.ceil(_EARTH_RADIUS*1.2)
      max = Math.floor(-(_EARTH_RADIUS*1.2))
      x = Math.floor(Math.random() * (max - min)) + min
      y = Math.floor(Math.random() * (max - min)) + min
      pos = Math.random()
      if (pos >= 0.5)
        z = Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)
      else
        z = -Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)

      cube.position.x = x
      cube.position.y = y
      cube.position.z = z
      scene.add(cube)
      this.#sceneObjects.push(cube)
      this.#litter.push(cube);
    }

    //Cones
    for (var i= 0 ;i<5;i+=1) {
      min = Math.ceil(_EARTH_RADIUS/24);
      max = Math.floor(_EARTH_RADIUS/20);
      height = Math.floor(Math.random() * (max - min)) + min
      radius = Math.floor(Math.random() * (max - min)) + min
      radius = radius/2

      radialSegments = 30  // ui: depthSegments
      geometry = new THREE.ConeGeometry(radius, height, radialSegments)
      material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
      cube = new THREE.Mesh( geometry, material )

      min = Math.ceil(_EARTH_RADIUS*1.2)
      max = Math.floor(-(_EARTH_RADIUS*1.2))
      cube.raioCol = Math.sqrt((radius**2) + ((height/2)**2))
      min = Math.ceil(84)
      max = Math.floor(-84)
      x = Math.floor(Math.random() * (max - min)) + min
      y = Math.floor(Math.random() * (max - min)) + min
      pos = Math.random()
      if (pos >= 0.5)
        z = Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)
      else
        z = -Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)

      cube.position.x = x
      cube.position.y = y
      cube.position.z = z
      scene.add(cube)
      this.#sceneObjects.push(cube)
      this.#litter.push(cube);
    }

    //Pyramids
    for (var i= 0 ;i<5;i+=1) {
      min = Math.ceil(_EARTH_RADIUS/24);
      max = Math.floor(_EARTH_RADIUS/20);
      height = Math.floor(Math.random() * (max - min)) + min
      radius = Math.floor(Math.random() * (max - min)) + min
      radius = radius/2

      radialSegments = 4  // ui: depthSegments
      geometry = new THREE.ConeGeometry(radius, height, radialSegments)
      material = new THREE.MeshBasicMaterial( { color: 0xfc9803 } )
      cube = new THREE.Mesh( geometry, material )
      cube.raioCol = Math.sqrt((radius**2) + ((height/2)**2))

      min = Math.ceil(_EARTH_RADIUS*1.2)
      max = Math.floor(-(_EARTH_RADIUS*1.2))
      x = Math.floor(Math.random() * (max - min)) + min
      y = Math.floor(Math.random() * (max - min)) + min
      pos = Math.random()
      if (pos >= 0.5)
        z = Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)
      else
        z = -Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)

      cube.position.x = x
      cube.position.y = y
      cube.position.z = z

      scene.add(cube)
      this.#sceneObjects.push(cube)
      this.#litter.push(cube);
    }

    // Spaceship
    const group = new THREE.Group();
    min = Math.ceil(_EARTH_RADIUS*1.2)
    max = Math.floor(-(_EARTH_RADIUS*1.2))
    x = Math.floor(Math.random() * (max - min)) + min
    y = Math.floor(Math.random() * (max - min)) + min
    pos = Math.random()
    if (pos >= 0.5)
      z = Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)
    else
      z = -Math.sqrt((_EARTH_RADIUS*1.2)**2 - x**2 - y**2)

    geometry = new THREE.CylinderGeometry(3, 3, 5, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffff00})
    spaceshipBody = new THREE.Mesh(geometry, material)
    spaceshipBody.position.x = 0
    spaceshipBody.position.y = 0
    spaceshipBody.position.z = 0
    this.getCompound().setPrimary(spaceshipBody)
    this.getCompound().setSecondary(followCamera)
    followCamera.position.x = 0
    followCamera.position.y = -30
    followCamera.position.z = -30
    followCamera.lookAt(this.getCompound().getGroup().position)

    spaceshipBody.position.x = x
    spaceshipBody.position.y = y
    spaceshipBody.position.z = z

    geometry = new THREE.CylinderGeometry(1, 1, 0.5, 32)
    material = new THREE.MeshBasicMaterial({color: 0xffff00})
    spaceshipHead = new THREE.Mesh(geometry, material)
    spaceshipHead.position.y = 3.5
    this.getCompound().setSecondary(spaceshipHead)

    geometry = new THREE.CapsuleGeometry( 0.6, 1, 4, 8 );
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    let capsule = new THREE.Mesh( geometry, material );
    capsule.position.x = 0
    capsule.position.y = -2
    capsule.position.z = 2.8
    this.getCompound().setSecondary(capsule)

    geometry = new THREE.CapsuleGeometry( 0.6, 1, 4, 8 );
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    capsule = new THREE.Mesh( geometry, material );
    capsule.position.x = -2.8
    capsule.position.y = -2
    capsule.position.z = 0
    this.getCompound().setSecondary(capsule)

    geometry = new THREE.CapsuleGeometry( 0.6, 1, 4, 8 );
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    capsule = new THREE.Mesh( geometry, material );
    capsule.position.x = 2.8
    capsule.position.y = -2
    capsule.position.z = 0
    this.getCompound().setSecondary(capsule)

    geometry = new THREE.CapsuleGeometry( 0.6, 1, 4, 8 );
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    capsule = new THREE.Mesh( geometry, material );
    capsule.position.x = 0
    capsule.position.y = -2
    capsule.position.z = -2.8
    this.getCompound().setSecondary(capsule)

    this.#compound.raioCol = 5.52;

    scene.add(this.getCompound().getGroup())
    this.#sceneObjects.push(this.getCompound().getGroup())


  }

  /**
   * Check for collisions. If there is a collision, remove the litter from the scene
   */
  #checkCollision = () => {
    /* Check for collisions*/
    for (var i = 0; i < this.#litter.length; i++) {

      /* Call function to detect collision*/
      var x1 = this.#litter[i].position.x;
      var y1 = this.#litter[i].position.y;
      var z1 = this.#litter[i].position.z;

      var x2 = this.getCompound().getPrimary().position.x;
      var y2 = this.getCompound().getPrimary().position.y;
      var z2 = this.getCompound().getPrimary().position.z;

      var x = Math.abs(x1 - x2);
      var y = Math.abs(y1 - y2);
      var z = Math.abs(z1 - z2);

      var distance = 0;
      if (x !== 0 || y !== 0 || z !== 0) {
        distance = Math.sqrt((x * x) + (y * y) + (z * z));
      }

      /* We have to remove this litter from the scene*/
      if (distance <= this.#litter[i].raioCol + this.#compound.raioCol) {
        this.#scene.remove(this.#litter[i])

        this.#litter.slice(i, 1)
      }
    }
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

    this.#checkCollision()


    /* Prompts key controller to check which keys were pressed and to delegate actions to the various components */
    this.getController().processKeyPressed(this.getContext(), this.getSceneObjects(), this.getCompound(), delta, _EARTH_RADIUS*1.2)

    this.getCompound().getPrimary().lookAt(0, 0, 0)

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

const _EARTH_RADIUS = 70
