<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
	$: invalid = form?.validation;
</script>

<svelte:head>
	<title>Login - Planning Poker</title>
</svelte:head>

<div class="variant-glass-surface border-b border-black/5  dark:border-white/5">
	<div class="container mx-auto space-y-8 p-32 text-center">
		<h1>Hi there, who are you?</h1>
		<form method="post" use:enhance>
			<label class="label">
				<div
					class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
					class:input-error={invalid}
				>
					<div class="input-group-shim">👋</div>
					<input type="text" name="name" placeholder="My name is..." />
					<button class="variant-filled-primary">Let's go!</button>
				</div>
				{#if invalid?.name}
					<span class="text-error-500">{invalid.name}</span>
				{/if}
			</label>
		</form>
	</div>
</div>
