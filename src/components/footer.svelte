<script lang="ts">

import { onMount } from "svelte";
import { clickables } from "../store";

let githubLink, emailLink

onMount(() => {
	clickables.update(value => [...value, githubLink, emailLink]);
})

</script>

<style lang="sass">

@import "../../consts.sass"
@include textStyles()

.footer-wrapper
    width: 100vw
    background-color: #131314
    display: flex
    flex-direction: row
    justify-content: space-between
    padding: 15vh 13vw
    margin-top: 25vh
    box-sizing: border-box

    @media only screen and (max-width: 950px)
        flex-direction: column-reverse

        .flex-wrapper:not(:first-child)
            margin-bottom: 15vh


    .inline-flex
        flex-grow: 1
        display: flex
        flex-direction: row
        align-items: center

        .logo
            display: inline-block
            height: 6vh
        h6
            font-family: $font
            font-size: 3.5vh
            font-weight: normal
            margin-left: 0.7vw

    .button-wrapper
        margin-top: 5vh
        margin-bottom: 3vh

        .button
            font-size: 3.5vh
            margin-right: 1vw
    
    .credits
        font-size: 1.5vh
        white-space: nowrap

    .large
        font-size: 2.5vh

        @media only screen and (max-width: 950px)
            br
                display: none

</style>

<div class="footer-wrapper">
	<div class="flex-wrapper">
        <div class="inline-flex">
            <img src="assets/imgs/logo.svg" alt="mh logo" class="logo">
            <h6>© 2021</h6>
        </div>
        <div class="button-wrapper">
            <span class="button" bind:this={emailLink}><a href="mailto:musabhassan04@gmail.com" target="_blank" class="clickable sublink link">Email</a></span>
		    <span class="button" bind:this={githubLink}><a href="https://github.com/Musab-Hassan" target="_blank" class="clickable sublink link">Github</a></span>
        </div>
        <p class="credits">
            designed and developed by musab hassan<br>
            this webste is open source on github
        </p>
    </div>
    <div class="flex-wrapper">
        <p class="large">
            i am currently accepting freelance work,<br> you may reach me on my email.
        </p><br><br>
        <p class="button large">musabhassan04@gmail.com</p>
    </div>
</div>