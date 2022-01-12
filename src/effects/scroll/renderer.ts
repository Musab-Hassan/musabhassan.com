
import { MeshRenderer } from "../defaults/renderer";
import { ScrollableImageMesh } from "./image";

export class ScrollRenderer extends MeshRenderer {

    images; meshItems; scrollContainer; slickScroll;
    scrollOffset: any;

    constructor(args: { container, images: any[], slickScroll?, scrollContainer, scrollOffset? }) {
        super(args.container);

        this.scrollOffset = args.scrollOffset || 1.0;
        this.images = args.images;
        this.meshItems = [];
        this.slickScroll = args.slickScroll;
        this.scrollContainer = args.scrollContainer;
        this.setup();
    }

    setup(): void {
        // Assign meshItem instances to each image
        this.images.forEach(i => {
            let meshItem = new ScrollableImageMesh(this.scrollContainer, i, this.scene);
            this.meshItems.push(meshItem);
        });

        super.setup();

        // Add canvas as a slickScroll offset
        if (this.slickScroll) this.slickScroll.addOffset({ element: this.renderer.domElement, speedY: this.scrollOffset });
    }

    render(): void {
        // run render() on each sliderImageMesh instance
        for (let i = 0; i < this.meshItems.length; i++) {
            this.meshItems[i].render();
        }

        super.render();
    }

}