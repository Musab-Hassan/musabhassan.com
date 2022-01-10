
import * as THREE from "three"
import { MeshItem } from "./mesh";
import { isUnsupportedClient } from "../../utils";

export class SliderEffect {

    // Passed properties
    container; images;
    meshItems; scene; camera; renderer;

    constructor(container, images: any[]) {
        if (isUnsupportedClient()) return;

        this.container = container;
        this.images = images;
        this.meshItems = [];
        this.setup();
    }

    get dimensions() {
        let width = window.innerWidth;
        let height = this.container.getBoundingClientRect().height;
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio
        };
    }

    setup() {
        this.scene = new THREE.Scene();

        // Initialize perspective camera
        const fov = (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;
        this.camera = new THREE.PerspectiveCamera(fov, this.dimensions.aspectRatio, 1, 1000)
        this.camera.position.set(0, 0, 1000); // Camera position on the z axis.

        // Set Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.dimensions.width, this.dimensions.height); // Set canvas size
        this.renderer.setPixelRatio(window.devicePixelRatio); // Ensures image textures are not blurred.
        this.container.appendChild(this.renderer.domElement); // Append canvas to container

        // Assign meshItem instances to each image
        this.images.forEach(i => {
            let meshItem = new MeshItem(i, this.scene);
            this.meshItems.push(meshItem);
        });

        window.addEventListener('resize', this.windowResize.bind(this), false);

        this.render();
    }

    windowResize() {
        // Readjust aspect ratio and fov
        this.camera.aspect = this.dimensions.aspectRatio;
        this.camera.fov = (180 * (2 * Math.atan(this.dimensions.height / 2 / 1000))) / Math.PI;
        
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.dimensions.width, this.dimensions.height);
    }

    render() {
        // run render() on each meshItem instance
        for (let i = 0; i < this.meshItems.length; i++) {
            this.meshItems[i].render();
        }

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}
