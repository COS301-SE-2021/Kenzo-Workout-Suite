import {Component, ElementRef, HostListener, OnInit, ViewChild} from "@angular/core";
import * as THREE from "./three.js-master/build/three.module.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Storage} from "@ionic/storage";

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

    // Height used to get canvas size
    public headerHeight;
    public footerHeight;

    // Coordinates as per the sliders in UI
    public xCoordinate: number;
    public yCoordinate: number;
    public zCoordinate: number;
    public selection;
    public originalCoordinates = [];

    // Stored Frames
    private frames: string[] = new Array();
    private frameColor: string[] = new Array();
    private skeletons;
    private selectedFrame = 0;

    // Texture Mapping
    private wall = "red_brick.jpg";
    private roof = "black_fancy.jpg";
    private floor = "marble.jpg";

    constructor(public alertController: AlertController, public route: Router, private storage: Storage) {
        this.xCoordinate = 0;
        this.yCoordinate = 0;
        this.zCoordinate = 0;
        this.selection = -1;
        this.skeletons = new Array(4);
        this.storage.create();
        for (let i = 0; i < this.skeletons.length; i++) {
            this.skeletons[i] = [];
        }
        this.getFrames();
    }

    ngOnInit() {

    }

    async getFrames(){
        const frames = await this.storage.get("images");
        const skeletons = await this.storage.get("skeletons");
        if(frames!=null){
            for (let i = 0; i < frames.length; i++) {
                if(frames[i]!=null){
                    this.frames[i] = frames[i];
                    this.frameColor[i] = "#30324A";
                }
            }
        }

        if(skeletons!=null){
            for (let i = 0; i < skeletons.length; i++) {
                this.skeletons[i] = skeletons[i];
            }
        }
        this.frameColor[0] = "#eb445a";
    }

  /**
   * This function listens for the window to be resized, and re-renders this scene appropriately.
   *
   * @author Luca Azmanov, u19004185
   * @param event that is triggered, in this case, the window being resized
   */
  @HostListener("window:resize", ["$event"])
    onResize(event) {
        this.camera.aspect = event.target.innerWidth / (event.target.innerHeight-this.headerHeight-this.footerHeight);
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
      document.getElementById("instructions").style.display = "none";
      document.getElementById("controls").style.display = "block";
      document.getElementById("save-back").innerText = "Save";
      this.headerHeight = document.getElementById("header").offsetHeight;
      this.footerHeight = document.getElementById("footer").offsetHeight;
      this.getFrames();
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
          60,
          window.innerWidth / (window.innerHeight-this.headerHeight-this.footerHeight),
          0.1,
          1000
      );

      // Init Render and Size
      this.renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
      this.renderer.setSize(window.innerWidth, window.innerHeight-this.headerHeight-this.footerHeight);
      this.element.appendChild(this.renderer.domElement);

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

          // Set initial pose positions
          for (let i = 0; i < 4; i++) {
              if(this.skeletons[i].length===0) {
                  for (let j = 0; j < this.mesh.skeleton.bones.length; j++) {
                      const bone = this.mesh.skeleton.bones[j];
                      this.skeletons[i][j] = ({value: j, x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z});
                      this.originalCoordinates[j] = ({value: j, x: bone.rotation.x, y: bone.rotation.y, z: bone.rotation.z});
                  }
              }
          }

          for (let i = 0; i < this.mesh.skeleton.bones.length; i++) {
              this.mesh.skeleton.bones[i].rotation.x = this.skeletons[0][i].x;
              this.mesh.skeleton.bones[i].rotation.y = this.skeletons[0][i].y;
              this.mesh.skeleton.bones[i].rotation.z = this.skeletons[0][i].z;
          }

          // Retrieve Textures to set Scene
          const texture= new THREE.TextureLoader().load("assets/avatar/"+this.floor);
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(4, 4);
          const brickTexture = new THREE.TextureLoader().load("assets/avatar/"+this.wall);
          const roofTexture= new THREE.TextureLoader().load("assets/avatar/"+this.roof);
          roofTexture.wrapS = THREE.RepeatWrapping;
          roofTexture.wrapT = THREE.RepeatWrapping;
          roofTexture.repeat.set(4, 4);

          // Set Scene
          // FLOOR
          const geometry = new THREE.BoxGeometry( 13, 0.5, 13 );
          const material = new THREE.MeshBasicMaterial( {map: texture} );
          const floor = new THREE.Mesh( geometry, material );
          tempScene.add( floor );
          floor.position.y-=2.1;

          // WALLS
          const geometry2 = new THREE.BoxGeometry( 13, 8, 0.5 );
          const material2 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const backWall = new THREE.Mesh( geometry2, material2 );
          tempScene.add( backWall );
          backWall.position.z-=6;
          backWall.position.y+=2;

          const geometry3 = new THREE.BoxGeometry( 13, 8, 0.5 );
          const material3 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const frontWall = new THREE.Mesh( geometry3, material3 );
          tempScene.add( frontWall );
          frontWall.position.z-=-6;
          frontWall.position.y+=2;

          const geometry4 = new THREE.BoxGeometry( 0.5, 8, 13 );
          const material4 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const rightWall = new THREE.Mesh( geometry4, material4 );
          tempScene.add( rightWall );
          rightWall.position.x-=-6;
          rightWall.position.y+=2;

          const geometry5 = new THREE.BoxGeometry( 0.5, 8, 13 );
          const material5 = new THREE.MeshBasicMaterial( {map: brickTexture} );
          const leftWall = new THREE.Mesh( geometry5, material5 );
          tempScene.add( leftWall );
          leftWall.position.x-=6;
          leftWall.position.y+=2;

          // ROOF
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
      this.controls.maxDistance = 6;
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
      } else{
          if(this.mesh!=null) {
              this.getCoordinates(0);
          }
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
   * This function is called upon the selection of a body part. The purpose is to set the sliders
   * to the selected boyd part's current state.
   *
   * Other feature include, the storage of the initial state of the body part, with the intention of resetting
   *
   * @param value
   * @author Luca Azmanov, u19004185
   */
  async getCoordinates(value) {
      this.selection = value;
      this.xCoordinate = this.mesh.skeleton.bones[value].rotation.x * 100;
      this.yCoordinate = this.mesh.skeleton.bones[value].rotation.y * 100;
      this.zCoordinate = this.mesh.skeleton.bones[value].rotation.z * 100;
  }

  /**
   * This function is called upon the activation of one of the 4 frame buttons. Upon use,
   * this function stores the current scene as seen by the camera in a Base64 image, to be parsed through
   * the API.
   *
   * Other features include:
   * The physical appearance of the button being altered.
   * The ability to remove an image.
   *
   * @param frame
   * @author Luca Azmanov, u19004185
   */
  async saveFrame() {
      // Save Coordinates of this Frame
      // Set initial pose positions
      for (let i = 0; i < this.mesh.skeleton.bones.length; i++) {
          this.skeletons[this.selectedFrame][i].x = this.mesh.skeleton.bones[i].rotation.x;
          this.skeletons[this.selectedFrame][i].y = this.mesh.skeleton.bones[i].rotation.y;
          this.skeletons[this.selectedFrame][i].z = this.mesh.skeleton.bones[i].rotation.z;
      }

      const frame = this.selectedFrame;
      const strMime = "image/jpeg";

      this.camera.aspect = 1920/1080;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(1920, 1080);
      this.renderer.render(this.scene, this.camera);

      const imgData = this.renderer.domElement.toDataURL(strMime);

      this.camera.aspect = window.innerWidth / (window.innerHeight-this.headerHeight-this.footerHeight);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight-this.headerHeight-this.footerHeight);
      this.renderer.render(this.scene, this.camera);

      this.frames[frame] = imgData;
  }

  /**
   * This function globally sets the selected frame for saving and clearing
   *
   * @param frame
   * @author Luca Azmanov, u19004185
   */
  selectFrame(frame: number){
      this.saveFrame();
      this.frameColor[this.selectedFrame] = "#30324A";
      this.selectedFrame = frame;
      this.frameColor[frame] = "#eb445a";
      // console.log(this.skeletons);

      for (let i = 0; i < this.mesh.skeleton.bones.length; i++) {
          this.mesh.skeleton.bones[i].rotation.x = this.skeletons[this.selectedFrame][i].x;
          this.mesh.skeleton.bones[i].rotation.y = this.skeletons[this.selectedFrame][i].y;
          this.mesh.skeleton.bones[i].rotation.z = this.skeletons[this.selectedFrame][i].z;
      }
      if(this.selection===-1) {
          return;
      }
      this.getCoordinates(this.selection);
  }

  /**
   * Helper Function to physically present alert to User independent of OS.
   *
   * @param alert
   * @author Luca Azmanov, u19004185
   */
  async presentAlert(alert: any) {
      await alert.present();
      await alert.onDidDismiss();
  }

  /**
   * This function returns back to the create-exercise screen with the new frames.
   *
   * @author Luca Azmanov, u19004185
   */
  returnToCreate() {
      this.saveFrame();
      this.route.navigate(["/create-exercise"]).then(async () => {
          await this.storage.set("images", this.frames);
          await this.storage.set("skeletons", this.skeletons);
          document.getElementById("sync").click();
      });
  }

  /**
   * Resets the selected component
   */
  resetPart() {
      if(this.selection===null) {
          return;
      }
      this.xCoordinate = this.originalCoordinates[this.selection].x * 100;
      this.yCoordinate = this.originalCoordinates[this.selection].y * 100;
      this.zCoordinate = this.originalCoordinates[this.selection].z * 100;
  }

  setBackground(value: any) {
      switch (value){
      case "0":
          this.wall = "red_brick.jpg";
          this.roof = "black_fancy.jpg";
          this.floor = "marble.jpg";
          break;
      case "1":
          this.wall = "fancy.jpg";
          this.roof = "marble.jpg";
          this.floor = "victorian.jpg";
          break;
      case "2":
          this.wall = "Studio_wall.jpg";
          this.roof = "modern.jpg";
          this.floor = "texture.jpg";
          break;
      case "3":
          this.wall = "black.jpg";
          this.roof = "black.jpg";
          this.floor = "black.jpg";
          break;
      default:
          this.wall = "brick.jpg";
          this.roof = "marble.jpg";
          this.floor = "texture.jpg";
      }
      this.element.removeChild(this.renderer.domElement);
      this.initScene();
  }
}
