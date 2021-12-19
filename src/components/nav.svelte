<script lang="ts">
import { onMount } from "svelte";
import { clickables } from "../store";

let home, work, about, email, logo, mobileMenu, navBar;

onMount(() => {
	clickables.update(value => [...value, home, work, about, email, logo, mobileMenu]);
});

</script>

<style lang="sass">

@import "../../consts.sass"

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

	.logo-icon
		display: inline-block
		height: 6vh
		width: 7vh
		mix-blend-mode: exclusion
		cursor: pointer

	ul.nav-list
		list-style-type: none
		mix-blend-mode: exclusion

		li
			font-family: $font
			text-transform: lowercase
			font-size: 2.5vh
			display: inline-block

			div 
				display: inline-block
				cursor: pointer

			a
				color: white
				text-decoration: none

			&:not(:last-child)::after
				margin-right: 0.3vw
				margin-left: 0.5vw
				content: "-"

	.hb-button
		cursor: pointer
		position: relative
		z-index: 21

		*
			display: inline-block
			vertical-align: middle

		.text
			font-family: $font
			font-size: 2.5vh
			text-transform: lowercase

		.hb
			width: 3vh
			height: 2.1vh
			margin-right: 1.5vh

			span
				transition: 0.8s ease
				-webkit-transition: 0.8s ease
				-moz-transition: 0.8s ease
				display: block
				position: relative
				top: 0
				right: 0
				height: 2px
				width: 100%
				background-color: white

				&:nth-child(1)
					top: 0

				&:nth-child(2)
					top: 0.5vh

				&:nth-child(3)
					top: 1.1vh

		&.close
			.text
				color: white

			.hb
				span
					background-color: white
					top: 0.5vh

					&:nth-child(1)
						transform: translateY(100%) rotate(-45deg)
						width: 100%

					&:nth-child(2)
						width: 0

					&:nth-child(3)
						transform: translateY(-100%) rotate(45deg)
						width: 100%

@media only screen and (min-width: 950px)
	.hb-button
		display: none

	.nav-list
		display: block

@media only screen and (max-width: 950px)
	.hb-button
		display: block

	.nav-list
		display: none
</style>

<div class="nav-wrapper" bind:this={navBar}>
	<div class="flex-wrapper">
		<img 
			bind:this={logo} 
			src="assets/imgs/logo.svg"
			class = "logo-icon clickable"
			alt="Logo"
			draggable="false"
		>
	</div>
    
	<div class="flex-wrapper">
		<ul class="nav-list">
			<li><div bind:this={home}>Home</div></li>
			<li><div bind:this={work}>Work</div></li>
			<li><div bind:this={about}>About</div></li>
			<li bind:this={email}><a href="mailto:musabhassan04@gmail.com" target="_blank">Email</a></li>
		</ul>

		<div class="hb-button clickable" bind:this={mobileMenu}>
			<div class="hb">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<div class="text">Menu</div>
		</div>
	</div>
</div>