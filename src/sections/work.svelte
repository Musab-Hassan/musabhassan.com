<script lang="ts">

import { onMount } from "svelte";
import { clickables, isWorkScroll, workScrollSpeed } from "../store";
import { SliderEffect } from "../effects/work-slider/renderer";

let isHold = false; // is user holding click
let _viewLinks = []; // Array of clickable Links
let container, listContainer; // Binds to containers
let images = []; // Array of images to be passed to WebGL Shader

isWorkScroll.subscribe(v => {
	isHold = v;
});


// Slider calculations and rendering
let currentMouseX = 0, initialMouseX = 0;
let currentPosition = 0, initialPosition = 0;
let offsetSpeed = 4000, lerpSpeed = 0.075;

class WorkSlider {

    onInitHold(e) {
        if (isHold) return;

        initialMouseX = e.clientX;
        isWorkScroll.set(true);

        if (isHold) {
            let style = window.getComputedStyle(listContainer);
            let matrix = new WebKitCSSMatrix(style.transform);
            initialPosition = matrix.m41;
        }
    }

    onRelease() {
        isWorkScroll.set(false);
    }

    onMouseMove(e) {
        if (isHold) currentMouseX = e.clientX;
    }

    animate() {
        let endPoint = listContainer.offsetWidth - document.body.clientWidth
        if (endPoint < 0) endPoint = listContainer.offsetWidth;

        let diff = (currentMouseX - initialMouseX) * -1;
		let targetPosition = initialPosition - (offsetSpeed * (diff / document.body.clientWidth));

        // Checks for disabling overscrolling
        if (targetPosition > 0) targetPosition = 0;
        if (targetPosition <= (endPoint * -1)) targetPosition = -endPoint;

        // Lerp easing
        currentPosition = lerp(currentPosition, targetPosition, lerpSpeed);
		
        // Svelte store value for the Canvas effect
        workScrollSpeed.set(currentPosition - targetPosition);

        listContainer.style.transform = `translateX(${currentPosition}px)`;

        requestAnimationFrame(this.animate.bind(this));
    }
}

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}




// Fetch work data
const workItemsFetch = new Promise(async (resolve: (data: any[]) => void) => {
	resolve(await (await fetch("data.json")).json());
});

const slider = new WorkSlider();

onMount(async () => {
	listContainer.style.transform = "translate3d(0px, 0px, 0px)";
	
	await workItemsFetch; // Wait for workItems to load

	clickables.update(values => values.concat(_viewLinks)); // Add clickables to clickables store

	slider.animate(); // Begin slider calculations
	new SliderEffect(container, images); // ThreeJS warping effect
});

</script>



<div id="content-container" class="work-click-area" style = "margin-top:20vh;">
	<div class="content-wrapper" 
		on:mousedown={slider.onInitHold}
		on:mouseup={slider.onRelease}
		on:mouseleave={slider.onRelease}
		on:mousemove|preventDefault={slider.onMouseMove}
		bind:this={container}
	>
		<ul class="work-list" bind:this={listContainer} class:isHold>
			<!-- Work items render here -->
			{#await workItemsFetch then items}
				{#each items as item, i}
					<li class="list-item clickable passive" data-id="{item.id}">
						<div class="img-wrapper">
							<img bind:this={images[i]}
								on:dragstart|preventDefault 
								draggable="false" 
								src="assets/imgs/work-back/{item.id}/cover.jpg" 
								alt="{item.title} Background Image">
						</div>
						<div class="text-top-wrapper">
							<p class="item-date">{item.date}</p>
							<!-- <p class="item-summary">{item.summary}</p> -->
						</div>
						<div class="text-wrapper">
							<h1 class="item-title">{item.title}</h1>
							<div class="button" bind:this={_viewLinks[i]}>view</div>
						</div>
					</li>
				{/each}
			{/await}
		</ul>
	</div>
</div>



<style lang="sass">

\:global(canvas)
	position: absolute
	top: 0
	left: 0
	z-index: -10

@import "../consts.sass"
@include textStyles()

#content-container.work-click-area .content-wrapper
	display: flex
	flex-direction: column
	cursor: grab
	position: relative
	
	*
		-webkit-touch-callout: none
		-webkit-user-select: none
		-moz-user-select: none
		-ms-user-select: none
		user-select: none

	ul.work-list
		margin-top: auto
		margin: auto 0
		padding: 0 5vw
		list-style-type: none
		display: flex
		flex-direction: row
		align-items: center
		height: 70vh
		min-width: min-content

		&.isHold
			.list-item
				height: 60vh !important
			
			.list-item .w-animate
				opacity:0 !important

		.list-item
			display: inline-flex
			overflow: hidden
			height: 70vh
			width: 30vw
			box-sizing: border-box
			position: relative
			overflow: hidden
			z-index: 3
			margin-right: 8vh
			transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s cubic-bezier(0.25, 1, 0.5, 1)

			&.hover
				height: 70vh

				img
					opacity: 1

			.img-wrapper
				overflow: hidden
				height: 100%
				z-index: 1
				position: relative
				width: 85%
				border-radius: 0.2vh
				box-shadow: 3px 9px 18px rgba(0, 0, 0, 0.2)
				
				img
					height: 110%
					width: 110%
					object-fit: cover
					position: absolute
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%)
					-webkit-transform: translate(-50%, -50%)
					opacity: 0.5

			.scroll-done
				transition: 0.8s opacity ease
				-webkit-transition: 0.8s opacity ease

			.text-top-wrapper
				position: absolute
				top: 6vh
				right: 0
				font-family: $font
				z-index: 2
				word-wrap: break-word
				white-space: normal
				text-align: right

				.item-date
					font-size: 1.4vw
					letter-spacing: 0.1vw
					text-transform: lowercase

			.text-wrapper
				box-sizing: border-box
				position: absolute
				bottom: 10vh
				right: 0
				text-align: right
				z-index: 2

				.button
					font-size: 4vh
					margin-top: 2vh

				.item-title
					font-family: $font
					font-weight: normal
					font-size: 3.6vw
					z-index: 0
					opacity: 1
					letter-spacing: 0.1vw
					line-height: 110%
					word-spacing: 80vw
					text-transform: lowercase
					word-wrap: break-word
					white-space: normal


				.inline-wrapper
					width: 100%
					position: relative
					margin-top: 1vh

					*
						display: inline-block

		@media only screen and (max-width: 1450px)
			.list-item
				width: 25vw

				.text-wrapper
					width: calc(40vw - 10vh)

		@media only screen and (max-width: 1110px)
			.list-item
				width: 30vw

				.item-date
					font-size: 2vw

				.text-wrapper
					width: calc(55vw - 10vh)

					.item-title
						font-size: 4vw

		@media only screen and (max-width: 650px)
			.list-item
				width: 40vw

				.item-date
					font-size: 3vw

				.text-wrapper
					width: calc(70vw - 10vh)

					.item-title
						font-size: 6vw

</style>