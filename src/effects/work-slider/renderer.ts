
import { MeshRenderer } from "../defaults/renderer";
import { SliderImageMesh } from "./item";

export class ImageRenderer extends MeshRenderer {

    images; meshItems;

    constructor(container, images: any[]) {
        super(container);

        this.images = images;
        this.meshItems = [];
        this.setup();
    }

    setup(): void {
        // Assign meshItem instances to each image
        this.images.forEach(i => {
            let meshItem = new SliderImageMesh(i, this.scene);
            this.meshItems.push(meshItem);
        });

        super.setup();
    }

    render(): void {
        // run render() on each sliderImageMesh instance
        for (let i = 0; i < this.meshItems.length; i++) {
            this.meshItems[i].render();
        }

        super.render();
    }

}