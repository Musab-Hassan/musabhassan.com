<script lang="ts">

import { onMount } from "svelte";
import { clickables as clickableStore, isMobile, isWorkScroll } from "../store";

let container;
let clickables;

// Svelte class toggles for hover-container
let hover: boolean = false;
let disabled: boolean = false;
let introDisabled: boolean = true;


/** Svelte store subscriptions **/
isWorkScroll.subscribe(val => {
	disabled = val;
})

clickableStore.subscribe(value => {
	clickables = value;
});


abstract class CursorDot {

	static currentPosition = {
		x: 0,
		y: 0
	};
	static targetPosition = {
		x: 0,
		y: 0
	};

	// onMouseMove, set current mouse coords and detect if any clickables are hovered
	static updateMouseCoords(e) {
		// Dont do anything if its a touch mobile device
		if ($isMobile) return;
		// Intro animation for cursor dot
		if (introDisabled) setTimeout(() => introDisabled = false, 500);

		let clickable = false;

		let cursor = window.getComputedStyle(e.target)["cursor"];
		hover = (cursor === "pointer");

		// clickable transition if mouse changes to pointer
		if (cursor === "pointer") {

			let currentlyHovering = document.elementFromPoint(e.clientX, e.clientY);
			
			let width = currentlyHovering.clientWidth;
			let height = currentlyHovering.clientHeight;
			
			let clickableMid = {
				x: (currentlyHovering.getBoundingClientRect().left + (width / 2)),
				y: (currentlyHovering.getBoundingClientRect().top + (height / 2))
			}

			this.targetPosition = {
				x: clickableMid.x + ((clickableMid.x - e.clientX)*0.15),
				y: clickableMid.y + ((clickableMid.y - e.clientY)*0.15)
			};
		} else {
			// Otherwise, follow the cursor
			this.targetPosition = {
				x: e.clientX,
				y: e.clientY
			}
		}
	}


	// Animation loop for tweening (only call once)
	static animate() {
		let t = 0.4;

		this.currentPosition.x += this.easeInOutQuad(t) * (this.targetPosition.x - this.currentPosition.x);
		this.currentPosition.y += this.easeInOutQuad(t) * (this.targetPosition.y - this.currentPosition.y);
		
		// Fix js's weird rounding errors
		this.currentPosition.x = Math.ceil(this.currentPosition.x * 100) / 100;
		this.currentPosition.y = Math.ceil(this.currentPosition.y * 100) / 100;

		container.style.transform = `translate3d(${this.currentPosition.x}px, ${this.currentPosition.y}px, 0px)`;

		requestAnimationFrame(() => this.animate());
	}

	// Tweening function
	static easeInOutQuad(t) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}
}


// Run Animation Loop to begin tweening
onMount(() => {
	CursorDot.animate();
})


</script>



<svelte:body on:mousemove = {(e) => CursorDot.updateMouseCoords(e)}/>

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