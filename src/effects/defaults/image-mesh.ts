
import * as THREE from "three";

export class ImageMesh {

    element; dimensionsNode; material; scene; offset; sizes; geometry; uniforms; mesh; activeFragmentShader;
    shaders: {
        fragment: { vertical: string, horizontal: string },
        vertex: string
    }

    constructor(element, scene, shaders: { fragment: { vertical: string, horizontal: string }, vertex: any }, dimensionsNode, uniforms?) {
        this.element = element;
        this.scene = scene;
        this.shaders = shaders;
        this.uniforms = uniforms;
        this.dimensionsNode = dimensionsNode;
        this.offset = new THREE.Vector2(0, 0); // Mesh Position
        this.sizes = new THREE.Vector2(0, 0); // Mesh Size

        this.createMesh();
    }

    setDimensions(): void {
        const { width, height, left } = this.dimensionsNode.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set((left - (window.innerWidth / 2)) + (width / 2), 0);
    }

    createMesh(): void {
        this.setDimensions();
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 4, 6);

        const { width, height } = this.element.getBoundingClientRect();

        this.uniforms = {
            uTexture: { // Image Texture
                value: new THREE.TextureLoader().load(this.element.src)
            },
            uMeshSize: { // Mesh (Mask) Dimensions
                value: new THREE.Vector2(this.sizes.x, this.sizes.y)
            },
            uImgSize: { // Image (to be masked) dimensions
                value: new THREE.Vector2(width, height)
            },
            ...this.uniforms
        };

        this.activeFragmentShader = this.loadFragmentShader;
        this.mesh = new THREE.Mesh(this.geometry, new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.shaders.vertex,
            fragmentShader: this.activeFragmentShader,
            transparent: true
        }));

        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);
        this.scene.add(this.mesh);
    }

    render(): void {
        this.setDimensions();
        this.checkShader();

        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        const { width, height } = this.element.getBoundingClientRect();
        this.uniforms.uImgSize.value.set(width, height);
        this.uniforms.uMeshSize.value.set(this.sizes.x, this.sizes.y);
    }

    // Updates vertexShader
    checkShader(): void {
        if (this.loadFragmentShader === this.activeFragmentShader) return;
        this.activeFragmentShader = this.loadFragmentShader;

        this.mesh.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.shaders.vertex,
            fragmentShader: this.activeFragmentShader,
            transparent: true
        });
    }

    // Loads correct fragment shader based on aspect ratio
    private get loadFragmentShader(): string {
        if ((this.sizes.x / this.sizes.y) < 1) {
            return this.shaders.fragment.horizontal;
        } else {
            return this.shaders.fragment.vertical;
        }
    }
}

