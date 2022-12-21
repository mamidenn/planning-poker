<script lang="ts">
	import '../app.css';
	import Button from '$lib/Button.svelte';
	import { enhance } from '$app/forms';
</script>

<div class="container mx-auto flex flex-col justify-center items-center min-h-screen">
	<div class="flex self-end">
		<form method="post" action="/logout" use:enhance>
			<Button type="submit">Logout</Button>
		</form>
	</div>
	<slot />
</div>

<style lang="postcss">
	:global(body) {
		@apply bg-slate-800;
	}
</style>
