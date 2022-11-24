<script lang="ts">
	import Button from '$lib/Button.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Hi, who are you?</h1>
<form method="post">
	<div class="flex flex-col">
		<input name="name" type="text" placeholder="Name" maxlength="10" />
		{#if form?.validation?.name}<span class="validation-error">{form.validation.name}</span>{/if}
	</div>
	<Button class="self-end">Login</Button>
</form>

<style lang="postcss">
	h1 {
		@apply text-6xl font-bold text-purple-500 drop-shadow-md;
	}
	input {
		@apply text-4xl bg-transparent border-b-2 text-white outline-none;
	}
	.validation-error {
		@apply text-red-700 text-sm;
	}
</style>
