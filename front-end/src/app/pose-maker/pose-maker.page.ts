import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import * as THREE from "three";
import {NavController} from "@ionic/angular";

@Component({
    selector: "app-pose-maker",
    templateUrl: "./pose-maker.page.html",
    styleUrls: ["./pose-maker.page.scss"],
})
export class PoseMakerPage implements OnInit {

    @ViewChild("webgl")
    canvas: ElementRef;
    @ViewChild("start-button")
    startButton: ElementRef;
    private element: any;
    private scene: THREE.Scene;
    private camera;
    public renderer: THREE.WebGLRenderer;
    private geometry;
    public material;
    public cube: THREE.Mesh;

    constructor(public navCtrl: NavController) {
    }

    ngOnInit() {
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
        this.initialiseWebGLObjectAndEnvironment();
        this.renderAnimation();
    }

    /**
     * Initialise the WebGL objecty to be generated using
     * selected ThreeJS methods and properties
     *
     * @public
     * @method initialiseWebGLObjectAndEnvironment
     * @return
     */
    initialiseWebGLObjectAndEnvironment(): void {
    // Reference the DOM element that the WebGL generated object
    // will be assigned to
        this.element = this.canvas.nativeElement;

        // Define a new ThreeJS scene
        this.scene = new THREE.Scene();

        // Define a new ThreeJS camera from the following types:
        /*
         1. CubeCamera				(Creates 6 cameras - one for each face of a cube)
         2. OrthographicCamera		(Creates a camera using orthographic projection - object size stays constant
        							 regardless of distance from the camera)
         3. PerspectiveCamera		(Creates a camera using perspective projection - most common projection type
        							 for 3D rendering [designed to mimic the way the human eye sees])
         4. StereoCamera			(Dual PerspectiveCameras - used for 3D effects such as parallax barrier)
      */
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        // Define an object to manage display of ThreeJS scene
        this.renderer = new THREE.WebGLRenderer();

        // Resizes the output canvas to match the supplied width/height parameters
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Attach the canvas, where the renderer draws the scene, to the specified DOM element
        this.element.appendChild(this.renderer.domElement);

        // BoxGeometry class allows us to create a cube (with width, height and depth dimensions supplied as
        // parameters - default is 1 for these values)
        this.geometry = new THREE.BoxGeometry(1, 1, 1);

        // Define the material (and its appearance) for drawing the geometry to the scene
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });

        // Use the Mesh class to define a polygon mesh based object with the supplied geometry and material objects
        this.cube = new THREE.Mesh(this.geometry, this.material);

        // Add the object to the scene
        this.scene.add(this.cube);

        // Define the depth position of the camera
        this.camera.position.z = 5;
    }

    /**
     * Define the animation properties for the WebGL object rendered in the DOM element, using the requestAnimationFrame
     * method to animate the object
     *
     * @private
     * @method animate
     * @return
     */
    private _animate(): void {
        requestAnimationFrame(() => {
            this._animate();
        });

        // Define rotation speeds on x and y axes - lower values means lower speeds
        this.cube.rotation.x += 0.015;
        this.cube.rotation.y += 0.015;

        // Render the scene (will be called using the requestAnimationFrame method to ensure the cube is constantly animated)
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Render the animation
     *
     * @public
     * @method _renderAnimation
     * @return
     */
    renderAnimation(): void {
    //if (Detector.webgl)
    //{
        this._animate();
    /*}
      else {
         var warning = Detector.getWebGLErrorMessage();
         console.log(warning);
      }*/
    }
}
