<script lang="ts">
import { onMount } from "svelte";
import { fade } from "svelte/transition";
import { imgPromises, workItemsFetch } from "../store";

let loadPosition = 0;
let counter = 0;

onMount(async () => {
    await workItemsFetch;
    
    let length = $imgPromises.length;

    $imgPromises.forEach(async (promise) => {
        await promise;
        counter++;
        loadPosition = Math.round((counter / length) * 100);
    });
});

</script>

<style lang="sass">

@import "../consts.sass"
@include textStyles()

.wrapper
    width: 100vw
    height: 100vh
    position: fixed
    top: 0
    left: 0
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    z-index: 1000
    background-color: #222224

    .subtitle
        font-family: $font
        text-transform: lowercase
        font-weight: normal !important

</style>

<div class="wrapper">
    <p class="subtitle" transition:fade>{loadPosition}%</p>
</div>