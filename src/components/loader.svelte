<script lang="ts">
import { onMount } from "svelte";
import waitForElementTransition from 'wait-for-element-transition';
import { imgPromises, loaderAnimationResolve, workItemsFetch } from "../store";

let loadingPosition = 0;
let counter = 0;
let loader;
let loadingDone = false;

onMount(async () => {
    await workItemsFetch;
    
    let length = $imgPromises.length;

    $imgPromises.forEach(async (promise) => {
        await promise;
        counter++;
        loadingPosition = Math.round((counter / length) * 100);
        if (loadingPosition > 99) {
            waitForElementTransition(loader).then(() => {
                loadingDone = true;
                loadingPosition = 0;

                waitForElementTransition(loader).then(() => {
                    loaderAnimationResolve();
                });
            });
        }
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

    .loader-wrapper
        position: relative
        display: block
        height: 0.1rem
        width: 20rem

        .loader, .loader-background
            position: absolute
            top: 0
            height: 100%

        .loader-background
            width: 100%
            background-color: rgba(255, 255, 255, 0.1)

        .loader 
            background-color: white
            transition: width 0.8s ease

        .outro
            transition: width 0.8s ease
            right: 0 !important
            width: 0



</style>

<div class="wrapper">
    <div class="loader-wrapper">
        <div 
            class="loader-background"
            class:outro={loadingDone}></div>
        <div 
            bind:this={loader}
            class="loader"
            class:outro={loadingDone}
            style="width: {loadingPosition}%"></div>
    </div>
</div>