
import * as THREE from "three";
import { ImageMesh } from "../defaults/image-mesh";
import { fragmentShader, vertexShader } from "./shaders";

export class ScrollableImageMesh extends ImageMesh {

    container; element; scene; scrollSpeed;

    constructor(container, element, scene) {
        let shaders = {
            vertex: vertexShader,
            fragment: {
                vertical: fragmentShader().vertical,
                horizontal: fragmentShader().horizontal
            }
        }

        let uniforms = {
            uOffset: { //Distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: { // Opacity
                value: 1.0
            }
        }

        super(element, scene, shaders, element, uniforms);
        this.container = container;
        this.scrollSpeed = 0;
    }

    createMesh(): void {
        super.createMesh();
        this.element.parentElement.style.visibility = "hidden"; // Hide original image element
    }

    render(): void {
        super.render();

        this.setSpeed();
        this.uniforms.uOffset.value.set(0.0, this.scrollSpeed * 0.0002); // Warping and Distortion effect
    }

    private setSpeed() {
        let node = document.querySelector("._SS_wrapper");
        let matrix = new WebKitCSSMatrix(window.getComputedStyle(node).transform);

        this.scrollSpeed = (this.container.scrollTop - Math.abs(matrix.m42));
    }
}