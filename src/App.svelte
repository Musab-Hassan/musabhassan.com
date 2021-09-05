<script lang="ts">
	
	import HomeSection from "./sections/home.svelte";
	import WorkSection from "./sections/work.svelte";
	import AboutSection from "./sections/about.svelte";
	import NavComponent from "./components/nav.svelte"

</script>

<style lang="sass">

	
\:global(body)
	background-color: #2A2A2C
	overflow-x: hidden
	color: white

\:global(*)
	margin: 0
	paddding: 0
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
	will-change: opacity;

</style>

<NavComponent></NavComponent>
<HomeSection></HomeSection>
<WorkSection></WorkSection>
<AboutSection></AboutSection>

