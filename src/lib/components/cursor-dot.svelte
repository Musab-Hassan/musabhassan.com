<script lang="ts">

	import { loadPagePromise } from "$lib/store";
	import { workScrollState, viewPortState } from "$lib/state.svelte";

	// Svelte class toggles for hover-container
	let hover: boolean = $state(false);
	let introDisabled: boolean = $state(true);

	let currentPosition = {
		x: 0, y: 0
	};
	let targetPosition = {
		x: 0, y: 0
	};

	// onMouseMove, set current mouse coords and detect if any clickable is hovered
	function updateMouseCoords(e: MouseEvent) {
		// Don't do anything if its a touch mobile device
		if (viewPortState.isMobile) return;

		if (introDisabled) setTimeout(() => introDisabled = false, 200);

		let cursor = window.getComputedStyle((e as any).target)["cursor"];
		hover = (cursor === "pointer");

		// Clickable transition if mouse changes to pointer
		if (cursor === "pointer") {

			let currentlyHovering: Element = document.elementFromPoint(e.clientX, e.clientY)!;
			
			let width = currentlyHovering.clientWidth;
			let height = currentlyHovering.clientHeight;
			
			let clickableMid = {
				x: (currentlyHovering.getBoundingClientRect().left + (width / 2)),
				y: (currentlyHovering.getBoundingClientRect().top + (height / 2))
			}

			targetPosition = {
				x: clickableMid.x + ((clickableMid.x - e.clientX)*0.15),
				y: clickableMid.y + ((clickableMid.y - e.clientY)*0.15)
			}

		// Otherwise, follow the cursor
		} else {
			targetPosition = {
				x: e.clientX,
				y: e.clientY
			}
		}
	}


	// Animation loop for easing
	function animate(node: HTMLElement) {
		let t = 0.4;

		currentPosition.x += easeInOutQuad(t) * (targetPosition.x - currentPosition.x);
		currentPosition.y += easeInOutQuad(t) * (targetPosition.y - currentPosition.y);
		
		// Fix js's weird rounding errors
		currentPosition.x = Math.ceil(currentPosition.x * 100) / 100;
		currentPosition.y = Math.ceil(currentPosition.y * 100) / 100;

		node.style.transform = `translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0px)`;

		requestAnimationFrame(() => animate(node));
	}

	// Easing function
	function easeInOutQuad(t: number) {
		return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	}


</script>



<svelte:body onmousemove={(e) => updateMouseCoords(e)}/>

{#await loadPagePromise then _}
	<div class="dot-container active"
		class:hover
		class:disabled={ introDisabled || workScrollState.active }
		use:animate>
		<div class="dot"></div>
	</div>
{/await}



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

	&.disabled .dot
		width: 0 !important
		height: 0 !important

	&.hover .dot
		width: 7.5vh
		height: 7.5vh

</style>