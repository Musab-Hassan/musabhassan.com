
import * as THREE from "three";
import { workScrollSpeed } from "../../store";
import { ImageMesh } from "../defaults/image-mesh";
import { fragmentShader, vertexShader } from "./shaders";

export class SliderImageMesh extends ImageMesh {

    speed: number; clock: THREE.Clock;

    constructor(element: HTMLImageElement, scene: THREE.Scene) {
        let shaders = {
            vertex: vertexShader,
            fragment: { 
                vertical: fragmentShader().vertical,
                horizontal: fragmentShader().horizontal
            }
        }

        let uniforms = {
            uTime: {
                value: 0.0
            },
            uOffset: { //Distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: { // Opacity
                value: 0.7
            }
        }

        super(element, scene, shaders, element.parentElement!, uniforms);

        this.clock = new THREE.Clock();
        workScrollSpeed.subscribe(val => { // Get current slider speed from svelte stores
            this.speed = val;
        });
    }

    createMesh(): void {
        super.createMesh();
        this.element.parentElement!.style.visibility = "hidden"; // Hide original image element
    }

    render(): void {
        super.render();

        this.uniforms.uOffset.value.set(this.speed * -0.0003, Math.abs(this.speed * 0.00005)); // Warping and Distortion effect
        this.uniforms.uTime.value = this.clock.getElapsedTime() * 0.8;
    }
}