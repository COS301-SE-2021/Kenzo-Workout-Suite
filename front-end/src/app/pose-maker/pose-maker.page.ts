import {Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import * as THREE from "./three.js-master/build/three.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

@Component({
    selector: "app-pose-maker",
    templateUrl: "./pose-maker.page.html",
    styleUrls: ["./pose-maker.page.scss"],
})
export class PoseMakerPage implements OnInit {

    // Canvas Elements
    @ViewChild("webgl")
    canvas: ElementRef;
    @ViewChild("start-button")
    startButton: ElementRef;
    private element: any;
    private scene: THREE.Scene;
    private camera;
    public renderer: THREE.WebGLRenderer;
    public material;
    private controls;
    private mesh;

    // Body Parts
    public body;
    public lowerBody;
    public middleBody;
    public upperBody;
    public lowerNeck;
    public rightShoulder;
    public rightUpperArm;
    public rightElbow;
    public rightHand;
    public leftShoulder;
    public leftUpperArm;
    public leftElbow;
    public leftHand;
    public rightUpperLeg;
    public rightKnee;
    public rightFoot;
    public leftUpperLeg;
    public leftKnee;
    public leftFoot;

    // Potential Raycasting
    public mouse: THREE.Vector2;
    public rayCaster: THREE.Raycaster;

    // Height used to get canvas size
    public headerHeight;
    public footerHeight;

    // Coordinates as per the sliders in UI
    public xCoordinate: number;
    public yCoordinate: number;
    public zCoordinate: number;
    public selection: number;

    constructor() {
        this.xCoordinate = 0;
        this.yCoordinate = 0;
        this.zCoordinate = 0;
        this.selection = -1;
    }

    ngOnInit() {
    }

  /**
   * This function listens for the window to be resized, and re-renders this scene appropriately.
   *
   * @author Luca Azmanov, u19004185
   * @param event that is triggered, in this case, the window being resized
   */
  @HostListener("window:resize", ["$event"])
    onResize(event) {
        this.camera.aspect = event.target.innerWidth / event.target.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(event.target.innerWidth, event.target.innerHeight-this.headerHeight-this.footerHeight);
    }

  /**
   * Execute methods when page view has fully loaded
   *
   * @public
   * @method ionViewDidLoad
   * @return
   */
  start(): void {
      document.getElementById("start-button").style.display = "none";
      this.headerHeight = document.getElementById("header").offsetHeight;
      this.footerHeight = document.getElementById("footer").offsetHeight;
      this.initScene();
      this.renderAnimation();
  }

  /**
   * Initialises the ThreeJS scene and the loaded in graphics created by the Cracked Studios Team in Blender.
   * Other initialisations include:
   * Lighting
   * Camera Position
   * Orbit Controls
   *
   * @author Luca Azmanov, u19004185
   */
  initScene(): void {
      this.element = this.canvas.nativeElement;

      // Define a new ThreeJS scene
      this.scene = new THREE.Scene();
      const tempScene = this.scene;
      this.camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
      );

      // Init Render and Size
      this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight-this.headerHeight-this.footerHeight);
      this.element.appendChild(this.renderer.domElement);

      this.mouse = new THREE.Vector2();
      this.rayCaster = new THREE.Raycaster();

      // Load GLBs
      const loader = new GLTFLoader();
      loader.load("assets/avatar/ArmatureModel.glb", (glb)=>{

          const object = glb.scene;

          tempScene.add(object);
          object.scale.set(0.2, 0.2, 0.2);
          object.position.y-=0.2;

          this.mesh = tempScene.getObjectByName("Human_BaseMesh");
          this.body = this.mesh.skeleton.bones[0];
          this.lowerBody = this.mesh.skeleton.bones[1];
          this.middleBody = this.mesh.skeleton.bones[2];
          this.upperBody = this.mesh.skeleton.bones[3];
          this.lowerNeck = this.mesh.skeleton.bones[4];
          this.rightShoulder = this.mesh.skeleton.bones[7];
          this.rightUpperArm = this.mesh.skeleton.bones[8];
          this.rightElbow = this.mesh.skeleton.bones[9];
          this.rightHand = this.mesh.skeleton.bones[10];
          this.leftShoulder = this.mesh.skeleton.bones[11];
          this.leftUpperArm = this.mesh.skeleton.bones[12];
          this.leftElbow = this.mesh.skeleton.bones[13];
          this.leftHand = this.mesh.skeleton.bones[14];
          this.rightUpperLeg = this.mesh.skeleton.bones[17];
          this.rightKnee = this.mesh.skeleton.bones[18];
          this.rightFoot = this.mesh.skeleton.bones[19];
          this.leftUpperLeg = this.mesh.skeleton.bones[20];
          this.leftKnee = this.mesh.skeleton.bones[21];
          this.leftFoot = this.mesh.skeleton.bones[22];

          // Retrieve Textures to set Scene
          const texture= new THREE.TextureLoader().load("assets/avatar/texture.jpg");
          const brickTexture = new THREE.TextureLoader().load("assets/avatar/brick.jpg");
          const roofTexture= new THREE.TextureLoader().load("assets/avatar/roofTexture.jpg");

          // Set Scene
          const geometry = new THREE.BoxGeometry( 13, 0.5, 13 );
          const material = new THREE.MeshBasicMaterial( {map: texture} );
          const floor = new THREE.Mesh( geometry, material );
          tempScene.add( floor );
          floor.position.y-=2.1;

          const geometry2 = new THREE.BoxGeometry( 13, 13, 0.5 );
          const material2 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const backWall = new THREE.Mesh( geometry2, material2 );
          tempScene.add( backWall );
          backWall.position.z-=6;

          const geometry3 = new THREE.BoxGeometry( 13, 13, 0.5 );
          const material3 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const frontWall = new THREE.Mesh( geometry3, material3 );
          tempScene.add( frontWall );
          frontWall.position.z-=-6;

          const geometry4 = new THREE.BoxGeometry( 0.5, 13, 13 );
          const material4 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const rightWall = new THREE.Mesh( geometry4, material4 );
          tempScene.add( rightWall );
          rightWall.position.x-=-6;

          const geometry5 = new THREE.BoxGeometry( 0.5, 13, 13 );
          const material5 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const leftWall = new THREE.Mesh( geometry5, material5 );
          tempScene.add( leftWall );
          leftWall.position.x-=6;

          const geometry6 = new THREE.BoxGeometry( 13, 0.5, 13 );
          const material6 = new THREE.MeshBasicMaterial( {map: roofTexture} );
          const roof = new THREE.Mesh( geometry6, material6 );
          tempScene.add( roof );
          roof.position.y-=-6;

      }, (xhr)=>{
          console.log((xhr. loaded/xhr.total * 100) + "% loaded");
      }, ()=>{
          console.log("An error occurred");
      });

      this.scene = tempScene;

      // Add light-source for visibility of object
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(2, 2, 5);
      this.scene.add(light);

      const backLight = new THREE.DirectionalLight(0xffffff, 1);
      backLight.position.set(-2, 2, -5);
      this.scene.add(backLight);

      this.camera.position.set(0, 1, 2);
      this.scene.add(this.camera);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.update();
  }

  /**
   * Animation of scene. This function employs the logic to actual rotate certain body parts as selected, as well as
   * manipulating the orbit controls as per the users' usage
   *
   * @author Luca Azmanov, u19004185
   */
  private animate(): void {
      requestAnimationFrame(() => {
          this.animate();
      });

      if(this.selection !== -1) {
          this.mesh.skeleton.bones[this.selection].rotation.x = this.xCoordinate * 0.01;
          this.mesh.skeleton.bones[this.selection].rotation.y = this.yCoordinate * 0.01;
          this.mesh.skeleton.bones[this.selection].rotation.z = this.zCoordinate * 0.01;
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
  }

  /**
   * Render the animation
   *
   * @author Luca Azmanov, u19004185
   */
  renderAnimation(): void {
      this.animate();
  }

  /**
   * This function initialises the normalised mouse position with respect to the canvas
   *
   * @author Luca Azmanov, u19004185
   * @param value
   */
  // @HostListener("click", ["$event"])
  // onMouseClick(event){
  //     if(this.mouse!=null) {
  //         this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //         this.mouse.y = (event.clientY / (window.innerHeight-this.headerHeight-this.footerHeight)) * 2 - 1;
  //         console.log(this.mouse);
  //         this.castRay();
  //     }
  // }
  //
  // castRay() {
  //     this.rayCaster.setFromCamera(this.mouse, this.camera);
  //     const intersects = this.rayCaster.intersectObjects(this.scene.children);
  //     for (let i=0; i<intersects.length; i++){
  //         console.log("ITEM "+i+"\t"+intersects[i].object.id);
  //     }
  // }

  getCoordinates(value) {
      this.selection = value;
      this.xCoordinate = this.mesh.skeleton.bones[value].rotation.x;
      this.yCoordinate = this.mesh.skeleton.bones[value].rotation.y;
      this.zCoordinate = this.mesh.skeleton.bones[value].rotation.z;
      console.log(this.xCoordinate, this.yCoordinate, this.zCoordinate);
  }
}
