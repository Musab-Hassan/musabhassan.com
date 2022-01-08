
import * as THREE from "three";
import { workScrollPosition } from "../../store";
import { fragmentShader, vertexShader } from "./shaders";

export class MeshItem {

    // TODO: Fix for ultrawide screens

    // Mesh and geometry
    element; scene; offset; sizes; geometry; uniforms; material; mesh;
    // Speed of workScroller
    speed: number;

    // Asyncronous image loading
    resolveImagePromise;
    imageLoadPromise = new Promise(r => {
        this.resolveImagePromise = r;
    });

    // Texture data
    image: HTMLImageElement;
    imageTexture: THREE.CanvasTexture;

    // Pass in the scene as we will be adding meshes to this scene.
    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); // Size of mesh on screen. Will be updated below.
        
        // Get current workScroller position through svelte stores
        workScrollPosition.subscribe(val => {
            this.speed = val;
        });
        
        this.createMesh();
    }

    setDimensions() {
        const { width, height, left } = this.element.parentElement.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - width * 1.5, 0);
    }

    async createMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 15, 15);

        this.imageTexture = new THREE.TextureLoader().load(this.element.src, (t) => {
            t.wrapS = THREE.MirrorRepeating;
            t.wrapT = THREE.MirrorRepeating;
            
            this.resolveImagePromise(); // Allow render to run
        });


        this.setDimensions();
        const imgBoundBox = this.element.getBoundingClientRect();

        this.uniforms = {
            uTexture: { //Texture
                value: this.imageTexture
            },
            uMeshSize: {
                value: new THREE.Vector2(this.sizes.x, this.sizes.y)
            },
            uImgSize: {
                value: new THREE.Vector2(imgBoundBox.width, imgBoundBox.height)
            },
            uOffset: { //Distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: { // Opacity
                value: 0.7
            }
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add(this.mesh);
    }

    async render() {
        await this.imageLoadPromise;

        this.setDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        // Warping and Distortion effect
        this.uniforms.uOffset.value.set(this.speed * -0.0003, this.speed * -0.00003); 
        // Object-fit cover effect
        this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);
    }
}

