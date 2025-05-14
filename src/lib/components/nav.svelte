<script lang="ts">

	import { animate } from "animejs";
	import { loadPagePromise } from "$lib/store";
	import { maskSlideIn } from "$lib/animations";
	import { browser } from "$app/environment";
    import { scrollAnchorState } from "$lib/state.svelte";
	interface Props {
		// Scroll container to allow scrolling when anchors are clicked
		scrollContainer: HTMLElement;
	}

	let { scrollContainer }: Props = $props();

	let mobileMenuActive: boolean = $state(false);
	let isMobileMenuAllowed: boolean = $state(browser ? window.innerWidth <= 950 : false);

	let mobileTransitionSwitcher = 
		$derived(mobileMenuActive ? 
		maskSlideIn : 
		(node: HTMLElement, _: any) => { 
			let out = maskSlideIn(node, {reverse: true, duration: 3000}); 
			return { 
				tick: (t: number) => {
					let reversedT = 1 - t;
					out.tick(reversedT);
					// Reset animation once all animations are done so desktop nav bar doesn't break
					if (t == 1) setTimeout(() => out.tick(1), 500);
				} 
			}
		});


	function navigate(anchor: HTMLElement) {
		scrollContainer.scrollTo({
			top: anchor.offsetTop - (window.innerHeight / 5),
			behavior: "smooth"
		});
		mobileMenuActive = false; 
	}

	function introAnimation(node: HTMLElement, params: { delay: number }) {
		if (isMobileMenuAllowed) return;
		node.style.transform = "translateY(130%) rotate(7deg)"
		animate(node, {
			rotate: 0,
			translateY: "0%",
			easing: "cubicBezier(0.165, 0.84, 0.44, 1)",
			duration: 1000,
			delay: params.delay
		});
	}

</script>

<svelte:window onresize={() => isMobileMenuAllowed = window.innerWidth <= 950}></svelte:window>

{#await loadPagePromise then _}
	<div class="nav-wrapper" style="transform: translate(0px);">
		<!-- Logo -->
		<div class="flex-wrapper ico" style="z-index: 21;">
			<button class="interactive clickable"
				onclick={() => navigate(scrollAnchorState.home!)}>

				<img src="assets/imgs/logo.svg"
					class="logo-icon"
					alt="Logo"
					draggable="false"
					use:introAnimation={{ delay: 1000 }}>
			</button>
		</div>
		
		<div class="flex-wrapper">
			<!-- Mobile and desktop nav menu -->
			<div class="wrapper" class:mobileMenuActive>
				<ul class="nav-list">
					{#key mobileMenuActive}
						<li use:introAnimation={{ delay: 1000 }}>
							<button 
								class="interactive clickable"
								onclick={() => navigate(scrollAnchorState.home!)} 
								in:mobileTransitionSwitcher={{ delay: 200 }}>
								Home
							</button>
						</li>
						<li use:introAnimation={{ delay: 1100 }}>
							<button 
								class="interactive clickable"
								onclick={() => navigate(scrollAnchorState.work!)} 
								in:mobileTransitionSwitcher={{ delay: 250 }}>
								<p>Work</p>
							</button>
						</li>
						<li use:introAnimation={{ delay: 1200 }}>
							<button 
								class="interactive clickable"
								onclick={() => navigate(scrollAnchorState.about!)} 
								in:mobileTransitionSwitcher={{ delay: 300 }}>
								About
							</button>
						</li>
						<li class="mobile">
							<a href="mailto:musab@musabhassan.com" target="_blank" in:mobileTransitionSwitcher={{ delay: 350 }}>Contact</a>
						</li>
						<li use:introAnimation={{ delay: 1300 }}>
							<a href="https://github.com/Musab-Hassan" target="_blank" in:mobileTransitionSwitcher={{ delay: 400 }}>Github</a>
						</li>
					{/key}
				</ul>
			</div>

			<!-- Mobile hambuger menu -->
			<div class="mask">
				<button class="interactive hb-button clickable"
					use:introAnimation={{ delay: 1000 }}
					onclick={() => mobileMenuActive = !mobileMenuActive} 
					class:mobileMenuActive
					aria-label="Open Menu">

					<div class="hb">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</button>
			</div>
		</div>
	</div>
{/await}



<style lang="sass">

@use "../consts.sass" as consts

button.interactive
	border: none
	background-color: transparent
	cursor: pointer

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

		*
			width: 100%
			height: 100%

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
				font-family: consts.$font
				text-transform: uppercase
				font-size: 2vh
				letter-spacing: 0.2vh
				display: inline-flex

				&.mobile
					display: none

				button 
					display: inline-block
					cursor: pointer
					color: white
					font-size: inherit
					font-family: inherit
					letter-spacing: inherit
					text-transform: uppercase

				a
					display: inline-block
					color: white
					text-decoration: none

				&:not(.mobile):not(:last-child)::after
					margin-right: 0.3vw
					margin-left: 0.5vw
					content: "-"

	@media only screen and (max-width: 950px)
		.wrapper
			position: fixed
			top: -10.1vh
			right: 0
			height: 100vh
			width: 0vw
			background-color: #131314
			transition: 0.9s cubic-bezier(.58, .14, .06, .97) width
			-webkit-transition: 0.9s cubic-bezier(.58, .14, .06, .97) width
			-moz-transition: 0.9s cubic-bezier(.58, .14, .06, .97) width
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

			&.mobileMenuActive
				left: 0
				width: 100vw

			li
				font-family: consts.$font
				font-weight: bolder
				text-transform: lowercase
				font-size: 9vw
				display: inline-flex
				box-sizing: border-box
				padding: 2vh 0

				&:not(:last-child)
					border-bottom: 1px solid rgba(255, 255, 255, 0.3)

				button 
					display: inline-block
					cursor: pointer
					font-size: inherit
					font-family: inherit
					color: white
					text-transform: inherit
					font-weight: inherit

				a
					display: inline-block
					color: white
					cursor: pointer
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

		&.mobileMenuActive
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