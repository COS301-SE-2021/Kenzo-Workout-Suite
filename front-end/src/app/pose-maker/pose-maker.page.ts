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
    public selection: number;

    // Stored Frames
    private frames: string[] = new Array();
    private frameColor: string[] = new Array();

    constructor(public alertController: AlertController, public route: Router, private storage: Storage) {
        this.xCoordinate = 0;
        this.yCoordinate = 0;
        this.zCoordinate = 0;
        this.selection = -1;
        this.storage.create();
        this.getFrames();
    }

    ngOnInit() {
    }

    async getFrames(){
        const frames = await this.storage.get("images");
        if(frames!=null){
            for (let i = 0; i < frames.length; i++) {
                if(frames[i]!=null){
                    this.frames[i] = frames[i];
                    this.frameColor[i] = "#1D905B";
                }
            }
        }
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
   * This function is called upon the selection of a body part. The purpose is to set the sliders
   * to the selected boyd part's current state.
   *
   * Other feature include, the storage of the initial state of the body part, with the intention of resetting
   *
   * @param value
   * @author Luca Azmanov, u19004185
   */
  async getCoordinates(value) {
      console.log(value);
      this.selection = value;
      this.xCoordinate = this.mesh.skeleton.bones[value].rotation.x * 100;
      this.yCoordinate = this.mesh.skeleton.bones[value].rotation.y * 100;
      this.zCoordinate = this.mesh.skeleton.bones[value].rotation.z * 100;
      console.log(this.mesh.skeleton.bones[value].rotation.x,
          this.mesh.skeleton.bones[value].rotation.y, this.mesh.skeleton.bones[value].rotation.z);
      console.log(this.xCoordinate, this.yCoordinate, this.zCoordinate);
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
  async saveFrame(frame: number) {
      if(this.frames[frame]!=null){
          let confirmation = false;
          const alert = await this.alertController.create({
              cssClass: "kenzo-alert",
              header: "Are you sure you would like to delete this frame?",
              buttons: [{text:"Delete",
                  handler: ()=>{
                      confirmation = true;
                  }}, "Cancel"]
          });

          await this.presentAlert(alert);
          if(!confirmation) {
              return;
          }

          this.frames[frame] = null;
          this.frameColor[frame] = "#FF6868";
          // console.log(JSON.stringify(this.frames));
          return;
      }

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

      // imgData = imgData.replace("data:image/jpeg;base64,", "");
      this.frames[frame] = imgData;
      this.frameColor[frame] = "#1D905B";

      // console.log(frame, imgData);
      // console.log(JSON.stringify(this.frames));
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
      this.route.navigate(["/create-exercise"]).then(async () => {
          await this.storage.set("images", this.frames);
          document.getElementById("sync").click();
      });
  }
}
