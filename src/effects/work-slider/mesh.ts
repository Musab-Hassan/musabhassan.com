
import * as THREE from "three";
import { workScrollSpeed } from "../../store";
import { fragmentShader, vertexShader } from "./shaders";

export class MeshItem {

    element; material; scene; offset; sizes; geometry; uniforms; mesh; activeFragmentShader;
    speed: number; // slider sliding speed
    clock = new THREE.Clock();

    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); // Size of mesh on screen. Will be updated below.

        workScrollSpeed.subscribe(val => { // Gets current workScroller position through svelte stores
            this.speed = val;
        });
        
        this.createMesh();
    }
    
    setDimensions() {
        const { width, height, left } = this.element.parentElement.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set((left - (window.innerWidth / 2)) + (width / 2), 0);
    }

    createMesh() {
        this.setDimensions();
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 15, 15);

        const { width, height } = this.element.getBoundingClientRect();

        this.uniforms = {
            uTexture: { // Texture
                value: new THREE.TextureLoader().load(this.element.src)
            },
            uTime: {
                value: 0.0
            },
            uMeshSize: { // Mesh (Mask) Dimensions
                value: new THREE.Vector2(this.sizes.x, this.sizes.y)
            },
            uImgSize: { // Image (to be masked) dimensions
                value: new THREE.Vector2(width, height)
            },
            uOffset: { //Distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: { // Opacity
                value: 0.7
            }
        };

        this.activeFragmentShader = this.loadFragmentShader;
        this.mesh = new THREE.Mesh(this.geometry, new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: this.activeFragmentShader,
            transparent: true
        }));

        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.scene.add(this.mesh);

        this.element.parentElement.style.visibility = "hidden"; // Hide original image element
    }

    render() {
        this.setDimensions();
        this.checkShader();
        
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        
        const { width, height } = this.element.getBoundingClientRect();
        this.uniforms.uImgSize.value.set(width, height);
        this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);
        this.uniforms.uOffset.value.set(this.speed * -0.0003, Math.abs(this.speed * 0.00005)); // Warping and Distortion effect
        this.uniforms.uTime.value = this.clock.getElapsedTime() * 0.8;
    }

    // Updates vertexShader
    checkShader() {
        if (this.loadFragmentShader === this.activeFragmentShader) return;
        this.activeFragmentShader = this.loadFragmentShader;

        this.mesh.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: this.activeFragmentShader,
            transparent: true
        });
    }

    // Loads correct fragment shader based on aspect ratio
    get loadFragmentShader() {
        if ((this.sizes.x / this.sizes.y) < 1) {
            return fragmentShader().horizontal;
        } else {
            return fragmentShader().vertical;
        }
    }
}

