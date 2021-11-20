<script lang="ts">
import { onMount } from "svelte";
import { clickables as clickableStore } from "../store";

onMount(() => {
    clickableStore.subscribe(value => {
        clickables = value;
    })
})

let container;

// TODO:
// Add hover class
// Add body pointer
let hover: boolean;
let x = 0;
let y = 0;

// Track the mouse with easing and handle hover effects
export function trackMouse(e) {
    
    let t = 0;
    let active;

    // For Work section to work:
    // if ($(".work-list").hasClass("hold")) return;

    let clickable = isHoveringClickable(e);
    hover = !!clickable;

    if (clickable) {
        let tempX = (clickable.getBoundingClientRect().left + (clickable.clientWidth / 2));
        let tempY = (clickable.getBoundingClientRect().top + (clickable.clientHeight / 2));

        active = {
            x: tempX + ((tempX - e.clientX)*0.1),
            y: tempY + ((tempY - e.clientY)*0.1)
        };
    } else {
        active = {
            x: e.clientX,
            y: e.clientY
        }
    }

    function loop() {
        x += (easeInOutQuad(t) * ((active.x - x) - (container.clientWidth / 2)));
        y += (easeInOutQuad(t) * ((active.y - y) - (container.clientHeight / 2)));

        container.style.left = x + "px";
        container.style.top = y + "px";
        
        if (t < 1) {
            t += 0.04;
            requestAnimationFrame(loop);
        }
    }
    loop();

    // For smooth animation on enter
    //
    // if (!$(container).hasClass("active")) {
    //     $(container).css("left", (e.clientX - $(container).width() / 2)+ "px");
    //     $(container).css("top", (e.clientY - $(container).height() / 2) + "px");
    //     $(container).css("display", "block");
    //     setTimeout(() => {
    //         $(container).addClass("active");
    //     }, 200);
    // }

    function easeInOutQuad(t) {
        return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
}

// Check if overlapping over a clickable item
// TODO: Fix broken hovers on scroll
function isHoveringClickable(e) {

    if (!clickables) return false;

    let isHover, hoverElem;
    
    clickables.forEach((ce) => {
        if (!ce) return;

        let elemTop = ce.getBoundingClientRect().top;
        let elemBottom = elemTop + ce.offsetHeight;
        let elemLeft = ce.getBoundingClientRect().left;
        let elemRight = elemLeft + ce.offsetWidth;

        if (!isHover) {
            isHover = (((e.pageY <= elemBottom) && (e.pageY >= elemTop)) && ((e.pageX >= elemLeft) && (e.pageX <= elemRight)));
            hoverElem = ce;
            if (hoverElem) {
                let x = hoverElem.getBoundingClientRect().left;
                let y = hoverElem.getBoundingClientRect().top;
                let topElt = document.elementFromPoint(x,y);
                if (topElt) {
                    let overlay = hoverElem.contains(topElt) || topElt.isSameNode(container);
                    
                    if (!overlay) isHover = false;
                }
            }
        }
    });

    if (isHover) return hoverElem;
    return false;
}

// For Work section to work:
// $(document).mouseup((e) => {setTimeout(() => {trackMouse(e)}, 50);});

let clickables;

</script>


<style lang="sass">

.hover-container
	position: fixed
	top: 0
	left: 0
	mix-blend-mode: exclusion
	pointer-events: none
	z-index: 1000
	display: block
	
	.hover-circle
		width: 0
		height: 0
		margin: 50px
		border-radius: 50%
		background-color: white
		transition: width 0.5s ease, height 0.5s ease
		-webkit-transition: width 0.5s ease, height 0.5s ease

		&:before, &:after
			content: ""
			position: absolute
			width: 0vh
			height: 0vh
			border: solid white
			border-width: 2px 2px 0 0
			top: calc(50% - 0.6vh);
			left: calc(50% - 0.6vh);
			transition: transform 0.5s ease, width 0.5s ease, height 0.5s ease
			-webkit-transition: transform 0.5s ease, width 0.5s ease, height 0.5s ease

	&.active
		.hover-circle
			width: 5vh
			height: 5vh

	&.scroll
		.hover-circle
			width: 4vh !important
			height: 4vh !important

			&:before, &:after
				width: 1vh
				height: 1vh

			&:before
				transform: translateX(-400%) rotate(-135deg)
				-webkit-transform: translateX(-400%) rotate(-135deg)

			&:after
				transform: translateX(400%) rotate(45deg)
				-webkit-transform: translateX(400%) rotate(45deg)

	&.hover 
		.hover-circle
			width: 7.5vh
			height: 7.5vh

</style>




<div class="hover-container active" 
    bind:this={container}
    class:hover>
    <div class="hover-circle"></div>
</div>