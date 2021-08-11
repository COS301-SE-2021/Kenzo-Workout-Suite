import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import * as THREE from "three";
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
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
    private controls;

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

        this.element = this.canvas.nativeElement;

        // Define a new ThreeJS scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.element.appendChild(this.renderer.domElement);
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true
        });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);
        this.camera.position.z = 5;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
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

        this.controls.update();

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
