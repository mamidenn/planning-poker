<script lang="ts">
	export let type: 'submit' | 'reset' | 'button' | undefined = 'button';
	export const click = () => button.click();
	let button: HTMLButtonElement;
</script>

<button on:click bind:this={button} {type}><slot /></button>

<style lang="postcss">
	button {
		@apply text-cyan-500 text-lg font-bold border-2 border-cyan-500 rounded-md shadow-md active:shadow-none active:translate-y-[1px] px-4 py-2;
	}
</style>
