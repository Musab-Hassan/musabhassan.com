
import * as THREE from "three";
import { workScrollSpeed } from "../../store";
import { fragmentShader, vertexShader } from "./shaders";

export class MeshItem {

    // TODO: Fix for ultrawide screens
    // TODO: Disable for mobile devices

    element; imageTexture; scene; offset; sizes; geometry; uniforms; material; mesh; 
    speed: number; // Speed of workScroller

    // Asyncronous image loading
    resolveImagePromise;
    imageLoadPromise = new Promise(r => {
        this.resolveImagePromise = r;
    });

    // Pass in the scene as we will be adding meshes to this scene.
    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); // Size of mesh on screen. Will be updated below.
        
        // Get current workScroller position through svelte stores
        workScrollSpeed.subscribe(val => {
            this.speed = val;
        });
        
        this.createMesh();
    }

    setDimensions() {
        const { width, height, left } = this.element.parentElement.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - width * 1.5, 0);
    }

    createMesh() {
        // Hide Element
        this.element.parentElement.style.visibility = "hidden";

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
        
        this.uniforms.uOffset.value.set(this.speed * -0.0003, Math.abs(this.speed * 0.00005)); // Warping and Distortion effect
        this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y); // Object-fit cover effect
    }
}

