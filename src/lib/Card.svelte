<script lang="ts">
	export let label = 'Card';
	export let orientation: 'faceUp' | 'faceDown' = 'faceUp';
</script>

<div
	class="flex flex-col justify-center items-center w-24 h-36 border-2 border-purple-500 rounded-md shadow-md p-1"
>
	{#if orientation === 'faceUp'}
		<div class="text-5xl font-semibold text-purple-500 ">{label}</div>
	{:else}
		<div class="h-full w-full rounded-sm card-back" />
	{/if}
</div>

<style>
	.card-back {
		background-image: url("data:image/svg+xml,<svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><defs><pattern id='a' patternUnits='userSpaceOnUse' width='40' height='20' patternTransform='scale(1) rotate(45)'><rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)'/><path d='M40 0L20-10V0l20 10zm0 10L20 0v10l20 10zm0 10L20 10v10l20 10zM0 20l20-10v10L0 30zm0-10L20 0v10L0 20zM0 0l20-10V0L0 10z'  stroke-width='2' stroke='rgb(168 85 247)' fill='none'/></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(%23a)'/></svg>");
	}
</style>
