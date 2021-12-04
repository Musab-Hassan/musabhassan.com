<script lang="ts">
	
	import HomeSection from "./sections/home.svelte";
	import WorkSection from "./sections/work.svelte";
	import AboutSection from "./sections/about.svelte";
	import NavComponent from "./components/nav.svelte"
	import Footer from "./components/footer.svelte";
	import CursorDot from "./components/cursor-dot.svelte"
	import slickScroll from "slickscrolljs";
	import { onMount } from "svelte";
	
	let trackedDot; // Mouse following dot
	let scrollContainer;
	let scrollResolve;
	let navBar;

	// Promise for slickScroll access from within components
	let scrollPromise = new Promise((r) => {
		scrollResolve = r;
	});

	onMount(async () => {
		// Resolve slickScroll promise and pass momentumScroll's value
		let slick = (new slickScroll).momentumScroll({
			root: scrollContainer,
			duration: 800,
			fixedOffsets: [
				navBar
			]
		});
		scrollResolve(slick);

		// Remove horizontal scrolling
		await scrollPromise;
		scrollContainer.style.overflowX = "hidden";
	});

</script>


<style lang="sass">
	
\:global(body)
	background-color: #222224
	overflow: hidden
	color: white
	margin: 0
	padding: 0

\:global(*)
	margin: 0
	padding: 0
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	will-change: opacity;

#scroll-frame
	height: 100%
	top: 0
	left: 0
	positon: relative
	width: 100%
	overflow-y: auto
	overflow-x: hidden

#nav-bar
	position: fixed
	top: 10vh
	z-index: 100

</style>


<svelte:body on:mousemove = {(e) => trackedDot.trackMouse(e)}/>
<CursorDot bind:this={trackedDot}></CursorDot>

<div id="scroll-frame" bind:this={scrollContainer}>
	<div id="nav-bar" bind:this={navBar}>
		<NavComponent></NavComponent>
	</div>
	<HomeSection bind:slickScroll={scrollPromise}></HomeSection>
	<WorkSection></WorkSection>
	<AboutSection bind:slickScroll={scrollPromise}></AboutSection>
	<Footer></Footer>
</div>



