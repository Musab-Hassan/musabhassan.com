<script lang="ts">
</script>

<div id="content-container" class="about">
	<div class="content-wrapper">
		<h1 class = "title">Name's<br>Musab</h1>
		<p class = "paragraph">
			I'm a web developer from British Columbia, Canada. I love writing beautiful code and creating memorable web experiences. I work with organizations and individuals to create taylor-made experiences designed to be beautiful, scalable, and affordable. If you like my work, you can send me an email for a chat.
		</p>
		<div class="button-wrapper">
			<span class="button"><a href="mailto:musabhassan04@gmail.com" target="_blank" class="clickable sublink link">Email</a></span>
			<span class="button"><a href="https://github.com/Musab-Hassan" target="_blank" class="clickable sublink link">Github</a></span>
			<span class="button"><a href="https://www.awwwards.com/musabhassan/" target="_blank" class="clickable sublink link">Awwwards</a></span>
		</div>
	</div>
	<div class="profile-image">
		<img src="assets/imgs/profile-photo.jpg" alt="Musab's Sillouette" class="profile-pic">
	</div>
</div>


<style lang="sass">

@import "../../consts.sass"
@include textStyles()

#content-container.about
	display: flex
	flex-direction: row
	justify-content: space-between
	overflow: hidden
	padding: 0 5vw
	margin-top: 40vh
	padding-bottom: 5vh

	.profile-image
		right: 0
		width: 100%
		height: 85vh
		padding-top: 10vh
		border-radius: 1.5vh
		overflow: hidden
		display: flex
		margin-top: 15vh

		img
			width: 100%
			height: 100%
			object-fit: cover

	.content-wrapper
		box-sizing: border-box
		width: 50%
		height: 100%
		margin: 0 2vw
		display: flex
		flex-direction: column
		justify-content: center
		margin-top: 5vh
		box-sizing: border-box
		z-index: 2

		h1
			font-size: 23vh

		.paragraph
			margin-top: 10vh
			margin-left: 14vw
			position: relative
			width: 75%
			text-align: justify
			text-justify: inter-word

			&::before
				content: ""
				position: absolute
				height: 2px
				width: 11vw
				right: 110%
				top: 15%
				background-color: white

		.button-wrapper
			margin-left: 14vw
			margin-top: 13vh
			font-size: 3.5vh
			width: 100%

			.button:not(:last-child)
				margin-right: 3vw

	@media only screen and (max-width: 950px)
		.right-container
			margin-top: 3vh
			justify-content: flex-start !important

		.profile-image
			display: none

</style>