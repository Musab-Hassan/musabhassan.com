<script lang="ts">

    import { onMount } from "svelte";
    import { waitForElementTransition } from '$lib/wait-for-element-transition';
    import { imgPromises, loaderAnimationResolve, workItemsFetch } from "$lib/store";

    let loader: HTMLElement = $state()!;
    let loadingDone = $state(false);
    let loadingPercentage = $state(0);

    onMount(async () => {

        let counter = 0;
        let length = $imgPromises.length;

        // Wait for work item loading from JSON file to complete
        await workItemsFetch;

        // Calculate percentage by how many images have loaded
        $imgPromises.forEach(async (promise) => {
            await promise;
            counter++;
            loadingPercentage = Math.round((counter / length) * 100);

            // If loading is complete, initiate outro animation
            if (loadingPercentage > 99) {
                waitForElementTransition(loader).then(() => {
                    loadingDone = true;
                    loadingPercentage = 0;

                    // Once outro animation is complete, resolve page loading promise, allowing intro animations to begin
                    waitForElementTransition(loader).then(() => {
                        loaderAnimationResolve();
                    });
                });
            }
        });
    });

</script>


<div class="page-cover">
    <div class="loader-wrapper">
        <div 
            class="loader-background"
            class:outro={loadingDone}></div>
        <div 
            bind:this={loader}
            class="loader"
            class:outro={loadingDone}
            style="width: {loadingPercentage}%"></div>
    </div>
</div>


<style lang="sass">

.page-cover
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