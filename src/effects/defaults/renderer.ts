
import * as THREE from "three"
import { isUnsupportedClient } from "../../utils";

export class MeshRenderer {

    // Passed properties
    container; scene; camera; renderer;

    constructor(container) {
        if (isUnsupportedClient()) return;

        this.container = container;
        this.scene = new THREE.Scene();
    }

    private get dimensions(): { width, height, aspect } {
        let width = window.innerWidth;
        let height = this.container.getBoundingClientRect().height;
        let aspect = width / height;
        return {
            width,
            height,
            aspect
        };
    }

    setup() {
        // Perspective camera
        const fov = (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.dimensions.aspect, 1, 1000)
        this.camera.position.set(0, 0, 1000); // Camera position on the z axis.

        // Set Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.dimensions.width, this.dimensions.height); // Set canvas size
        this.renderer.setPixelRatio(window.devicePixelRatio); // Ensures image textures are not blurred.
        this.container.appendChild(this.renderer.domElement); // Append canvas to container

        window.addEventListener('resize', this.windowResize.bind(this), false);

        this.render();
    }

    windowResize() {
        // Readjust aspect ratio and fov
        this.camera.aspect = this.dimensions.aspect;
        this.camera.fov = (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}
