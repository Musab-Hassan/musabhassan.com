<script lang="ts">
	
	import HomeSection from "./sections/home.svelte";
	import WorkSection from "./sections/work.svelte";
	import AboutSection from "./sections/about.svelte";
	import NavComponent from "./components/nav.svelte"
	import Footer from "./components/footer.svelte";
	import CursorDot from "./components/cursor-dot.svelte"
	import slickScroll from "slickscrolljs";
	import { onMount } from "svelte";
	
	let trackedDot; // Mosue following dot
	let scrollContainer;
	let scrollResolve;

	// Promise for slickScroll access from within components
	let scrollPromise = new Promise((r) => {
		scrollResolve = r;
	});

	onMount(async () => {
		// Resolve slickScroll promise and pass momentumScroll's value
		let slick = (new slickScroll).momentumScroll({
			root: scrollContainer
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


</style>


<svelte:body on:mousemove = {(e) => trackedDot.trackMouse(e)}/>
<CursorDot bind:this={trackedDot}></CursorDot>
<NavComponent></NavComponent>

<div id="scroll-frame" bind:this={scrollContainer}>
	<HomeSection bind:slickScroll={scrollPromise}></HomeSection>
	<WorkSection></WorkSection>
	<AboutSection></AboutSection>
	<Footer></Footer>
</div>



