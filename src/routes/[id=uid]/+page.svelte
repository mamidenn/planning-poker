<script lang="ts">
	import { realtime, type UserData } from '$lib/realtime';
	import type { PageServerData } from './$types';
	import CardDisplay from '$lib/CardDisplay.svelte';
	import type { Orientation } from '$lib/Card.svelte';
	import { writable } from 'svelte/store';

	export let data: PageServerData;
	let buttons: HTMLButtonElement[] = [];
	const user = writable<UserData>({ ...data.user, spectating: false });

	const { users, revealed } = realtime(data.id, user);
	let orientation: Orientation;
	$: orientation = $revealed ? 'faceUp' : 'faceDown';

	function userFirst(a: UserData, b: UserData) {
		if (a.id === data.user.id) return -2;
		if (b.id === data.user.id) return 2;
		return a.name.localeCompare(b.name);
	}
</script>

<svelte:head>
	<title>{data.id} - Planning Poker</title>
</svelte:head>

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
				...$users
					.filter(({ id, spectating }) => id !== data.user.id && !spectating)
					.concat(!$user.spectating ? [$user] : [])
					.sort(userFirst)
					.reduce((acc, { name, vote }) => ({ ...acc, [name]: vote }), {})
			}}
			{orientation}
		/>
	</div>
</div>
<div class="container mx-auto p-8 space-y-8 text-center">
	{#if $user.spectating}
		<h2>🔎 You are spectating</h2>
		<p>You can see the votes of other users, but you cannot vote yourself.</p>
	{:else}
		<h2>🗳️ Cast your vote</h2>
		<p>You can also press the number keys on your keyboard to vote.</p>
	{/if}
	<div class="flex flex-wrap justify-center gap-4">
		{#if !$user.spectating}
			<div class="btn-group variant-ghost-primary">
				{#each [1, 2, 3, 5, 8, 13, undefined] as vote}
					<button
						class:variant-filled-primary={vote === $user.vote}
						bind:this={buttons[vote ?? 0]}
						on:click={() => ($user.vote = vote)}>{vote ?? 'Abstain'}</button
					>
				{/each}
			</div>
		{/if}
		<span class="space-x-1">
			<button class="btn variant-filled-primary" on:click={() => ($revealed = !$revealed)}>
				Flip
			</button>
			<button class="btn variant-filled-secondary" on:click={() => ($user.vote = undefined)}>
				Reset
			</button>
			<button class="btn variant-ghost" on:click={() => ($user.spectating = !$user.spectating)}>
				<span>👻</span>
				<span>{$user.spectating ? 'Stop Spectating' : 'Spectate'}</span>
			</button>
		</span>
	</div>
</div>
