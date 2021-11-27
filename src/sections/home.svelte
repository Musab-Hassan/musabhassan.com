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
	// slickScroll.then((value) => {
	// 	console.log(value);
	// 	value.addOffset({
	// 		element: backgroundOffset,
	// 		speedY: 0.8
	// 	})
	// })
})

// Get slickScroll promise from App.svelte
export let slickScroll;

</script>

<div id="content-container" style="padding-top: 23vh">
	<div class="content-wrapper">
		<div class="flex">
			<div class="flex-container">
				<img draggable="false" src="assets/imgs/signature-white.png" alt="Musab Signature" class="h-signature">
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
				width: 30vh
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

</style>