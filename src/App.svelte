<script lang="ts">
	
import HomeSection from "./sections/home.svelte";
import WorkSection from "./sections/work.svelte";
import AboutSection from "./sections/about.svelte";
import NavComponent from "./components/nav.svelte"
import Footer from "./components/footer.svelte";
import CursorDot from "./components/cursor-dot.svelte"
import slickScroll from "slickscrolljs";
import Loader from "./components/loader.svelte";
import { onMount } from "svelte";
import { imgPromises, loadPageResolve, slickScrollInstance, workItemsFetch } from "./store";

let trackedDot; // Mouse following dot
let scrollContainer;
let navBar;
let loading = true;

onMount(async () => {
	// Disable scrolling on load
	scrollContainer.style.overflowY = "hidden";
	scrollContainer.scrollTo(0, 0);
	
	await workItemsFetch; // Wait for work data to load
	await Promise.allSettled($imgPromises); // Wait for images to load

	loading = false; // Destroy loader component 
	loadPageResolve(); // Resolve loadPagePromise

	// Resolve slickScroll promise and pass momentumScroll's value
	$slickScrollInstance = (new slickScroll).momentumScroll({
		root: scrollContainer,
		easing: "easeOutCirc",
		duration: 500,
		fixedOffsets: [
			navBar
		]
	});

	// Remove horizontal scrolling
	scrollContainer.style.overflowX = "hidden";

	// Enable scrolling once all intro animations are over
	setTimeout(() => {
		scrollContainer.style.overflowY = "auto";
	}, 3500);
});

</script>


<style lang="sass">
	
\:global(body)
	background-color: #222224
	overflow: hidden
	color: white
	margin: 0
	padding: 0
	-moz-osx-font-smoothing: grayscale
	-webkit-font-smoothing: antialiased

\:global(*)
	margin: 0
	padding: 0
	-moz-osx-font-smoothing: grayscale
	-webkit-font-smoothing: antialiased

#scroll-frame
	height: 100%
	top: 0
	left: 0
	position: relative
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

{#if loading} <Loader></Loader> {/if}

<div id="scroll-frame" bind:this={scrollContainer}>
	<div id="nav-bar" bind:this={navBar}>
		<NavComponent scrollContainer={scrollContainer}></NavComponent>
	</div>
	<HomeSection></HomeSection>
	<WorkSection></WorkSection>
	<AboutSection></AboutSection>
	<Footer></Footer>
</div>



