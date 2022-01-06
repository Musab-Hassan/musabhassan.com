
import * as THREE from "three";
import { workScrollPosition } from "../../store";
import { fragmentShader, vertexShader } from "./shaders";

export class MeshItem {

    element; scene; offset; sizes; geometry; imageTexture; uniforms; material; mesh;
    speed: number;

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
        this.offset.set(left, 0);
    }

    createMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
        this.imageTexture = new THREE.TextureLoader().load(this.element.src);
        this.uniforms = {
            uTexture: { //Texture
                value: this.imageTexture
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
            transparent: true,
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.setDimensions(); // set offsetand sizes for placement on the scene
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add(this.mesh);
    }

    render() {
        this.setDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0)
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.uOffset.value.set(this.speed * -0.0003, this.offset.y * 0.0)
    }
}