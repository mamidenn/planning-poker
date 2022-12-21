<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/Button.svelte';
	import Heading from '$lib/Heading.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: invalid = form?.validation;
</script>

<div class="flex flex-col items-end w-full">
	<Heading>Hi there, who are you?</Heading>
	<form method="post" class="flex flex-col items-end gap-4" class:invalid use:enhance>
		<div class="flex flex-col">
			<input
				name="name"
				type="text"
				placeholder="My name is..."
				minlength="1"
				maxlength="10"
				autocomplete="off"
				autocapitalize="off"
			/>
			{#if invalid?.name}<span class="validation-error">{invalid.name}</span>{/if}
		</div>
		<Button type="submit">Let's go!</Button>
	</form>
</div>

<style lang="postcss">
	input {
		@apply text-4xl bg-transparent border-b-2 border-gray-50/25 text-white outline-none;
	}
	.invalid input {
		@apply border-red-500/75;
	}
	.validation-error {
		@apply text-red-500/75 font-semibold text-sm;
	}
</style>
