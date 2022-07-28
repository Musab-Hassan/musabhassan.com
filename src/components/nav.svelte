<script lang="ts">

// Scroll container to allow scrolling when anchors are clicked
export let scrollContainer;

import anime from "animejs";
import { onMount } from "svelte";
import { clickables, homeAnchor, workAnchor, aboutAnchor, loadPagePromise } from "../store";

let homeElem, workElem, aboutElem, emailElem, logoElem, githubElem;
let homeWrapperElem, workWrapperElem, aboutWrapperElem, mobileMenuElem;

let mobileActive: boolean;

onMount(async () => {
	// Wait for page to load
	await loadPagePromise;
	// Register all anchors as clickables for the scroll dot
	clickables.update(value => [...value, homeElem, workElem, aboutElem, emailElem, logoElem, githubElem, mobileMenuElem]);
	// Initiate intro animations
	introAnimations();
});




function navigate(anchor) {
	scrollContainer.scrollTo({
		top: anchor.offsetTop - (window.innerHeight / 5),
		behavior: "smooth"
	});
	mobileActive = false; 
}

function introAnimations() {
	let targets = [logoElem, mobileMenuElem, homeWrapperElem, workWrapperElem, aboutWrapperElem, githubElem];
	// Set initial state to begin animation from
	targets.forEach(e => {
		e.style.transform = "translateY(125%) rotate(10deg)"
	})

	anime({
		targets: targets,
		rotate: 0,
		translateY: "0%",
		easing: "cubicBezier(0.165, 0.84, 0.44, 1)",
		duration: 1500,
		delay: anime.stagger(50, {start: + 500})
	});
}

</script>



<div class="nav-wrapper" style="transform: translate(0px);">
	<!-- Logo -->
	<div class="flex-wrapper ico" style="z-index: 21;">
		<img 
			bind:this={logoElem} 
			src="assets/imgs/logo.svg"
			class = "logo-icon clickable"
			alt="Logo"
			draggable="false"
			on:click={() => navigate($homeAnchor)}>
	</div>
	
	<div class="flex-wrapper">
		<!-- Mobile and desktop nav menu -->
		<div class="wrapper" class:mobileActive>
			<ul class="nav-list">
				<li bind:this={homeWrapperElem}>
					<div bind:this={homeElem} on:click={() => navigate($homeAnchor)}>Home</div>
				</li>
				<li bind:this={workWrapperElem}>
					<div bind:this={workElem} on:click={() => navigate($workAnchor)}>Work</div>
				</li>
				<li bind:this={aboutWrapperElem}>
					<div bind:this={aboutElem} on:click={() => navigate($aboutAnchor)}>About</div>
				</li>
				<li class="mobile" bind:this={emailElem}>
					<a href="mailto:musabhassan04@gmail.com" target="_blank">Email</a>
				</li>
				<li bind:this={githubElem}>
					<a href="https://github.com/Musab-Hassan" target="_blank">Github</a>
				</li>
			
		</div>

		<!-- Mobile hambuger menu -->
		<div class="mask">
			<div class="hb-button clickable" 
				bind:this={mobileMenuElem} 
				on:click={() => mobileActive = !mobileActive} 
				class:mobileActive>

				<div class="hb">
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	</div>
</div>



<style lang="sass">

@import "../consts.sass"

.nav-wrapper
	width: 100vw
	margin: 0 auto
	padding: 0 7vw
	box-sizing: border-box
	display: block
	z-index: 100
	display: flex
	flex-direction: row
	justify-content: space-between
	align-items: center

	.flex-wrapper.ico
		overflow: hidden
		height: 6vh
		width: 7vh
		mix-blend-mode: exclusion
		cursor: pointer

		.logo-icon
			position: relative
			display: inline-block
			height: 100%
			width: 100%

	@media only screen and (min-width: 950px)
		ul.nav-list
			list-style-type: none
			mix-blend-mode: exclusion
			overflow: hidden

			li
				font-family: $font
				text-transform: uppercase
				font-size: 2vh
				letter-spacing: 0.2vh
				display: inline-block

				&.mobile
					display: none

				div 
					display: inline-block
					cursor: pointer

				a
					color: white
					text-decoration: none

				&:not(.mobile):not(:last-child)::after
					margin-right: 0.3vw
					margin-left: 0.5vw
					content: "-"

	@media only screen and (max-width: 950px)
		.wrapper
			position: fixed
			top: -10vh
			left: 0
			height: 100vh
			width: 0vw
			background-color: #131314
			transition: 1s cubic-bezier(0.86, 0, 0.07, 1) width
			-webkit-transition: 1s cubic-bezier(0.86, 0, 0.07, 1) width
			-moz-transition: 1s cubic-bezier(0.86, 0, 0.07, 1) width
			overflow: hidden !important

			ul.nav-list
				list-style-type: none
				display: flex
				flex-direction: column
				position: relative
				justify-content: center
				height: 100%
				width: 100%
				box-sizing: border-box
				padding: 0 10vw
				padding-top: 10vh
				overflow: hidden !important

			&.mobileActive
				width: 100vw

			li
				font-family: $font
				font-weight: bolder
				text-transform: lowercase
				font-size: 9vw
				display: inline-block
				cursor: pointer
				padding: 2vh 0
				box-sizing: border-box

				&:not(:last-child)
					border-bottom: 1px solid rgba(255, 255, 255, 0.3)

				div 
					display: inline-block

				a
					display: inline-block
					color: white
					text-decoration: none

	.mask
		overflow: hidden

	.hb-button
		cursor: pointer
		position: relative
		z-index: 21

		*
			display: inline-block
			vertical-align: middle
			user-select: none
			-ms-user-select: none
			-moz-user-select: none

		.hb
			display: flex
			flex-direction: column
			justify-content: center
			row-gap: 5px
			width: 3vh
			height: 2.2vh
			margin-right: 1.5vh
			transition: row-gap 1s ease
			-webkit-transition: row-gap 1s ease
			-moz-transition: row-gap 1s ease

			span
				transition: 1s ease
				-webkit-transition: 1s ease
				-moz-transition: 1s ease
				display: block
				position: relative
				top: 0
				right: 0
				height: 2px
				width: 100%
				background-color: white

		&.mobileActive
			.text
				color: white

			.hb
				row-gap: 0px

				span
					background-color: white

					&:nth-child(1)
						transform: translateY(100%) rotate(-45deg)
						width: 100%

					&:nth-child(2)
						width: 0%

					&:nth-child(3)
						transform: translateY(-100%) rotate(45deg)
						width: 100%

@media only screen and (min-width: 950px)
	.hb-button
		display: none

@media only screen and (max-width: 950px)
	.hb-button
		display: block

</style>