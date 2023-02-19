<script lang="ts">
	import { realtime, type UserData } from '$lib/realtime';
	import type { PageServerData } from './$types';
	import CardDisplay from '$lib/CardDisplay.svelte';
	import type { Orientation } from '$lib/Card.svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;
	let buttons: HTMLButtonElement[] = [];
	const user = writable<UserData>({ ...data.user });

	const { users, revealed } = realtime(data.id, user);
	let orientation: Orientation;
	$: orientation = $revealed ? 'faceUp' : 'faceDown';
</script>

<!-- Add keyboard shortcuts for vote buttons -->
<svelte:window
	on:keypress={(e) => {
		if ([0, 1, 2, 3, 5, 8].map((k) => k.toString()).includes(e.key))
			buttons[parseInt(e.key)]?.click();
	}}
/>

<div class="variant-glass-surface border-b border-black/5  dark:border-white/5">
	<div class="container mx-auto p-16 space-y-8 text-center">
		<h1>👋 Hello {data.user.name}!</h1>

		<CardDisplay
			cards={{
				[data.user.name]: $user.vote,
				...$users
					.filter(({ id }) => id !== $user.id)
					.reduce((acc, { name, vote }) => ({ ...acc, [name]: vote }), {})
			}}
			{orientation}
		/>
	</div>
</div>
<div class="container mx-auto p-8 space-y-8 text-center">
	<h2>🗳️ Cast your vote</h2>
	<p>You can also press the number keys on your keyboard to vote.</p>
	<div class="space-x-4">
		<div class="btn-group variant-ghost-primary">
			{#each [1, 2, 3, 5, 8, 13, undefined] as vote}
				<button
					class:variant-filled-primary={vote === $user.vote}
					bind:this={buttons[vote ?? 0]}
					on:click={() => ($user.vote = vote)}>{vote ?? '?'}</button
				>
			{/each}
		</div>
		<span class="space-x-1">
			<button class="btn variant-filled-primary" on:click={() => ($revealed = !$revealed)}>
				Flip
			</button>
			<button class="btn variant-filled-secondary" on:click={() => ($user.vote = undefined)}
				>Reset</button
			>
		</span>
	</div>
</div>
