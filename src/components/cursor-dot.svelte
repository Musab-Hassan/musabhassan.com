<script lang="ts">

import { clickables as clickableStore, isMobile, isWorkScroll } from "../store";

let container;
let clickables;

// Svelte class toggles for hover-container
let hover: boolean = false;
let disabled: boolean = false;
let introDisabled: boolean = true;

let x = 0, y = 0;

// Track the mouse with easing and handle hover effects
export function trackMouse(e) {

	// Dont do anything if its a touch mobile device
	if ($isMobile) return;
	// Intro animation for cursor dot
	if (introDisabled) setTimeout(() => introDisabled = false, 500);

	let active, t = 0;

	let clickable = currentlyHoveredClickable(e);
	hover = !!clickable;

	// Clickale transition if hovering a clickable
	if (clickable) {
		let width = clickable.clientWidth;
		let height = clickable.clientHeight;
		
		let clickableMid = {
			x: (clickable.getBoundingClientRect().left + (width / 2)),
			y: (clickable.getBoundingClientRect().top + (height / 2))
		}

		active = {
			x: clickableMid.x + ((clickableMid.x - e.clientX)*0.15),
			y: clickableMid.y + ((clickableMid.y - e.clientY)*0.15)
		};
	} else {
		// Otherwise, follow the cursor
		active = {
			x: e.clientX,
			y: e.clientY
		}
	}

	// Animation loop to follow mouse cursor with a tweened delay
	(function loop() {
		x += easeInOutQuad(t) * (active.x - x);
		y += easeInOutQuad(t) * (active.y - y);

		x = Math.ceil(x * 100) / 100;
		y = Math.ceil(y * 100) / 100;
		
		if (t < 1) {
			t += 0.1;
			container.style.transform = `translate(${x}px, ${y}px)`;
			requestAnimationFrame(loop);
		}
	})();

	function easeInOutQuad(t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}
}

// Checks if a node within the clickables list is being hovered
function currentlyHoveredClickable(e) {

	if (!clickables) return false;

	let isHover, hoveredElem;
	
	// Iterate over every clickable to see if it intersects with cursor dot
	for (let i = 0; i < clickables.length; i++) {
		
		if (isHover) break;

		let currentClickable = clickables[i];
		let boundBox = currentClickable.getBoundingClientRect();

		if (!currentClickable) return false;
		
		// Checks to see if matched hovered elementis in scroll frame
		isHover = (
			(e.pageY <= boundBox.bottom) && 
			(e.pageY >= boundBox.top) && 
			(e.pageX >= boundBox.left) && 
			(e.pageX <= boundBox.right)
		);
			
		hoveredElem = currentClickable;

		let topElt = document.elementFromPoint(boundBox.left, boundBox.top);
		if (topElt) {
			let overlay = hoveredElem.contains(topElt) || topElt.isSameNode(container);
			
			if (!overlay) isHover = false;
		}
	}

	if (isHover) return hoveredElem;
	return false;
}


/** Svelte store subscriptions **/

isWorkScroll.subscribe(val => {
	disabled = val;
})

clickableStore.subscribe(value => {
	clickables = value;
});

</script>



<div class="dot-container active" 
	bind:this={container}
	class:hover
	class:disabled
	class:introDisabled>
	<div class="dot"></div>
</div>



<style lang="sass">

.dot-container
	position: fixed
	display: block
	top: 0
	left: 0
	z-index: 1000
	mix-blend-mode: exclusion
	pointer-events: none
	will-change: width, height

	.dot
		position: relative
		width: 0
		height: 0
		border-radius: 50%
		background-color: white
		transform: translate(-50%, -50%)
		transform: -webkit-translate(-50%, -50%)
		transform: -moz-translate(-50%, -50%)
		transition: width 0.5s ease, height 0.5s ease
		-webkit-transition: width 0.5s ease, height 0.5s ease

	&.active .dot
		width: 4vh
		height: 4vh

	&.disabled .dot, &.introDisabled .dot
		width: 0 !important
		height: 0 !important

	&.hover .dot
		width: 7.5vh
		height: 7.5vh

</style>