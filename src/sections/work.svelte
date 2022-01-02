<script lang="ts">

import { onMount } from "svelte";
import { clickables, isWorkScroll } from "../store";

// Add links to clickables svelte store
let _viewLinks = [];

onMount(() => {

    scrollElem.style.transform = "translateX(0px)";

    loadData.then(() => {
        clickables.update(values => values.concat(_viewLinks));
    });

    loop();
})



// Load work data
let loadData = new Promise(async (resolve: (data: any[]) => void) => {
    resolve(await (await fetch("data.json")).json());
});



// Work Scrolling Handlers
let scrollElem;

let maxSpeed = 5000;
let isWorkActive = false;
let isClick = false;
let initPosition = 0;
let activeMousePoxX = 0;
let initMousePosX = 0; 

isWorkScroll.subscribe(v => {
    isClick = v;
})


function enableScrollHold(e) {
	if (isClick) return;

	initMousePosX = e.clientX;
	isWorkScroll.set(true);

    if (isClick) {
        let style = window.getComputedStyle(scrollElem);
        let matrix = new WebKitCSSMatrix(style.transform);
        initPosition = matrix.m41;
    }
}


function cancelScrollHold() {
    isWorkScroll.set(false);
}

function updatePosition(e) {
    activeMousePoxX = e.clientX;
}


function loop() {
    if (isWorkActive || !isClick) {
        requestAnimationFrame(loop);
        return;
    }

    let endPoint = scrollElem.offsetWidth - document.body.clientWidth 
    if (endPoint < 0) endPoint = scrollElem.offsetWidth;

    let diff = (activeMousePoxX - initMousePosX) * -1;
    let calcPosition = initPosition - (maxSpeed * (diff / document.body.clientWidth));
    
    if (calcPosition > 0) calcPosition = 0;
    if (calcPosition <= (endPoint * -1)) calcPosition = endPoint*-1;

    scrollElem.style.transform = `translateX(${calcPosition}px)`;

    requestAnimationFrame(loop);
}


</script>



<div id="content-container" class="work-click-area" style = "margin-top:20vh;">
	<div class="content-wrapper" 
        on:mousedown={enableScrollHold}
        on:mouseup={cancelScrollHold}
        on:mouseleave={cancelScrollHold}
        on:mousemove|preventDefault={updatePosition}
    >
    <ul class="work-list" bind:this={scrollElem} class:isClick>
        <!-- Work items render here -->
        {#await loadData then items}
            {#each items as item, i}
                <li class="list-item clickable passive" data-id="{item.id}">
                    <div class="img-wrapper">
                        <img on:dragstart|preventDefault draggable="false" src="assets/imgs/work-back/{item.id}/cover.jpg" alt="{item.title} Background Image">
                    </div>
                    <div class="text-top-wrapper">
                        <p class="item-date">{item.date}</p>
                        <!-- <p class="item-summary">{item.summary}</p> -->
                    </div>
                    <div class="text-wrapper">
                        <h1 class="item-title">{item.title}</h1>
                        <div class="button" bind:this={_viewLinks[i]}>view</div>
                    </div>
                </li>
            {/each}
        {/await}
    </ul>
</div>
</div>



<style lang="sass">

@import "../consts.sass"
@include textStyles()

#content-container.work-click-area .content-wrapper
    display: flex
    flex-direction: column
    cursor: grab

    *
        -webkit-touch-callout: none
        -webkit-user-select: none
        -moz-user-select: none
        -ms-user-select: none
        user-select: none

    ul.work-list
        margin-top: auto
        margin: auto 0
        padding: 0 5vw
        list-style-type: none
        display: flex
        flex-direction: row
        align-items: center
        height: 70vh
        min-width: min-content
        transition: transform .5s ease-out

        &.isClick
            .list-item
                height: 60vh !important
            
            .list-item .w-animate
                opacity:0 !important

        .list-item
            display: inline-flex
            overflow: hidden
            height: 70vh
            width: 30vw
            box-sizing: border-box
            position: relative
            overflow: hidden
            z-index: 3
            margin-right: 8vh
            transition: width 0.8s cubic-bezier(0.25, 1, 0.5, 1), height 0.8s cubic-bezier(0.25, 1, 0.5, 1)

            &.hover
                height: 70vh

                img
                    opacity: 1

            .img-wrapper
                overflow: hidden
                height: 100%
                z-index: 1
                position: relative
                width: 85%
                border-radius: 0.2vh
                box-shadow: 3px 9px 18px rgba(0, 0, 0, 0.2)

                
                img
                    height: 110%
                    width: 110%
                    object-fit: cover
                    position: absolute
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%)
                    -webkit-transform: translate(-50%, -50%)
                    opacity: 0.5

            .scroll-done
                transition: 0.8s opacity ease
                -webkit-transition: 0.8s opacity ease

            .text-top-wrapper
                position: absolute
                top: 6vh
                right: 0
                font-family: $font
                z-index: 2
                word-wrap: break-word
                white-space: normal
                text-align: right

                .item-date
                    font-size: 1.4vw
                    letter-spacing: 0.1vw
                    text-transform: lowercase

            .text-wrapper
                box-sizing: border-box
                position: absolute
                bottom: 10vh
                right: 0
                text-align: right
                z-index: 2

                .button
                    font-size: 4vh
                    margin-top: 2vh

                .item-title
                    font-family: $font
                    font-weight: normal
                    font-size: 3.6vw
                    z-index: 0
                    opacity: 1
                    letter-spacing: 0.1vw
                    line-height: 110%
                    word-spacing: 80vw
                    text-transform: lowercase
                    word-wrap: break-word
                    white-space: normal


                .inline-wrapper
                    width: 100%
                    position: relative
                    margin-top: 1vh

                    *
                        display: inline-block

        @media only screen and (max-width: 1450px)
            .list-item
                width: 25vw

                .text-wrapper
                    width: calc(40vw - 10vh)

        @media only screen and (max-width: 1110px)
            .list-item
                width: 30vw

                .item-date
                    font-size: 2vw

                .text-wrapper
                    width: calc(55vw - 10vh)

                    .item-title
                        font-size: 4vw

        @media only screen and (max-width: 650px)
            .list-item
                width: 40vw

                .item-date
                    font-size: 3vw

                .text-wrapper
                    width: calc(70vw - 10vh)

                    .item-title
                        font-size: 6vw

</style>