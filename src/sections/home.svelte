<script lang="ts">

import { onMount } from "svelte";
import { clickables } from "../store";

// Links
let githubLink, linkedinLink, workLink;
// Offsets
let backgroundOffset;

onMount(() => {
	clickables.update(value => [...value, githubLink, linkedinLink, workLink]); // All links to clickables store

	// Add scroll offsets to slickScroll
	slickScroll.then((value) => {
		value.addOffset({
			element: backgroundOffset,
			speedY: 0.8
		})
	})
})

// Get slickScroll promise from App.svelte
export let slickScroll;

</script>

<div id="content-container" style="padding-top: 23vh">
	<div class="content-wrapper">
		<div class="flex">
			<div class="flex-container">

				<svg id="signature" class="h-signature" viewBox="0 0 190 277" >
					<g>
						<path
							class="path-1"
							style="fill:none;stroke:#ffffff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;"
							d="m 38.106433,126.87783 c 0,0 4.865856,-34.380072 39.573341,-37.703672 11.07324,-1.060378 -11.450219,86.225122 -48.943819,87.505612 -18.53491,0.63302 19.011912,-69.27759 51.724719,-84.353928 21.320226,-9.825843 15.273874,25.965428 15.273874,25.965428 0,0 6.177162,-9.2687 7.873312,-6.14451 1.69616,3.1242 0.14106,5.06521 6.85387,-1.87407 1.0166,-1.168 13.87944,3.27501 18.80372,-1.26145 1.42987,-1.31725 6.44242,1.2514 6.44242,1.2514" />
						<path
							class="path-2"
							style="fill:none;stroke:#ffffff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;"
							d="m 132.18539,124.21348 -23.91573,78.79214" />
						<path
							class="path-3"
							style="fill:none;stroke:#ffffff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;"
							d="m 110.30899,131.25842 c 0,0 -0.74157,11.67978 -2.7809,17.98315 -2.03933,6.30337 -6.67416,20.20787 -6.85955,24.10112" />
						<path
							class="path-4"
							style="fill:none;stroke:#ffffff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;"
							d="m 121.98876,150.35393 c 0,0 -5.93258,-7.97191 -17.05618,-6.67416 -11.123592,1.29776 -20.207862,11.30899 -21.134827,12.60675 -0.926968,1.29775 -10.011238,9.64044 2.224717,15.01685 12.235955,5.3764 38.93259,-7.23034 38.93259,-7.23034 0,0 17.79775,-10.01123 18.91011,-10.01123 1.11236,0 -4.63483,5.93258 -4.26405,7.23033 0.37079,1.29776 2.77483,2.03165 7.23034,-1.48314 0.97548,-0.76952 17.21937,-0.82644 22.21274,0.97637 1.8694,0.67493 3.48943,-0.21536 4.98153,-1.37648 0.97963,-0.76233 9.43868,2.03194 9.43868,2.03194" />
					</g>
				</svg>

			</div>
			
			<div class="flex-container" style="margin-right: 5vw; justify-content: flex-end">
				<h1 class = "title">Musab<br> Hassan</h1>
				<p class = "paragraph occupation">front-end web developer from BC Canada</p>
				<div class="wrapper">
					<div class="button primary" bind:this={workLink}>view work</div>
					<div class="button" bind:this={githubLink}><a href="https://github.com/Musab-Hassan" target="_blank">github</a></div>
					<div class="button" bind:this={linkedinLink}><a href="https://www.linkedin.com/in/musab-hassan/" target="_blank">linkedin</a></div>
				</div>
			</div>

			<div class="parallax-wrapper home-back" bind:this={backgroundOffset}>
				<img draggable="false" alt="Home Background" src="assets/imgs/home-back.jpg" style="width:100%; height: 100%; object-fit: cover;">
			</div>
		</div>
	</div>
</div>

<style lang="sass">

@import "../../consts.sass"
@include textStyles()

#content-container
	height: 100vh
	width: 100vw
	padding: 12vh 7vw
	box-sizing: border-box
	position: relative

	.content-wrapper
		position: relative
		height: 100%
		box-sizing: border-box
		z-index: 2

	.flex
		z-index: 2
		width: 95%
		height: 100%
		display: flex
		flex-direction: row
		justify-content: space-between
		position: relative
		box-sizing: border-box

		.flex-container
			position: relative
			height: 100%
			display: flex
			flex-direction: column
			justify-content: center

			.h-signature
				width: 35vh
				margin-left: -6vh

			.occupation
				position: relative
				margin-top: 8vh

				&::before
					content: ""
					position: absolute
					top: 50%
					right: 110%
					height: 2px
					width: 20%
					background-color: white

			.button
				font-size: 2.5vh

				&:not(:last-child)
					margin-right: 1vw

				&.primary
					margin-top: 10vh
					font-size: 3.2vh
					margin-right: 7vw

	.parallax-wrapper
		position: absolute
		left: 0
		z-index: -1
		width: 80%
		height: 100%
		margin-left: 5%
		border-radius: 1.5vh
		box-shadow: 3px 9px 18px rgba(0, 0, 0, 0.2)
		overflow: hidden
		box-sizing: border-box
		-webkit-touch-callout: none
		-webkit-user-select: none
		-moz-user-select: none
		-ms-user-select: none
		user-select: none
		opacity: 1

		@media only screen and (max-width: 1250px)
			&
				opacity: 0.7

		@media only screen and (max-width: 750px)
			&
				opacity: 0.3

		img
			height: 100%
			width: 100%
			object-fit: cover

@media only screen and (min-width: 1250px)
	.h-signature
		display: block

	#content-container .flex *
		text-align: left

@media only screen and (max-width: 1250px)
	#content-container .flex *
		text-align: left

	.h-signature
		display: none

	#content-container .flex .bottom
		text-align: left
		left: 5vw


#signature
	.path-1
		stroke-dasharray: 365
		stroke-dashoffset: 365
		animation: draw 1s cubic-bezier(.72,.3,.25,1) .5s forwards
	
	.path-2
		stroke-dasharray: 85
		stroke-dashoffset: 85
		animation: draw 0.3s cubic-bezier(.47,.41,.26,1) 1.5s forwards

	.path-3
		stroke-dasharray: 45
		stroke-dashoffset: 45
		animation: draw 0.2s cubic-bezier(.47,.41,.26,1) 1.8s forwards

	.path-4
		stroke-dasharray: 180
		stroke-dashoffset: 180
		animation: draw 1s cubic-bezier(.47,.41,.26,1) 2s forwards


@keyframes draw
  to
    stroke-dashoffset: 0

</style>