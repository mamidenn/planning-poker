<button on:click><slot /></button>

<style lang="postcss">
	button {
		@apply text-purple-500 font-medium border-2 border-purple-500 rounded-md shadow-md active:shadow-none active:translate-y-[1px] px-4 py-2;
	}
</style>
