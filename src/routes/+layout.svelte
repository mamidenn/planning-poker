<script lang="ts">
	import '../app.css';
</script>

<div class="container mx-auto flex justify-center items-center min-h-screen">
	<slot />
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-slate-800;
	}
</style>
