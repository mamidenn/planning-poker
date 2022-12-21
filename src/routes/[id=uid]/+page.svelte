<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	import type { PageServerData } from './$types';
	import CardDisplay from '$lib/CardDisplay.svelte';
	import Button from '$lib/Button.svelte';
	import _ from 'lodash';
	import Heading from '$lib/Heading.svelte';
	const { random, range } = _;

	export let data: PageServerData;
	let button: Button[] = [];
	$: console.log(button);

	const { user, users } = realtime(data.id, data.user);
</script>

<svelte:window
	on:keypress={(e) => {
		if ([1, 2, 3, 5, 8].map((k) => k.toString()).includes(e.key)) button[parseInt(e.key)]?.click();
	}}
/>

<Heading>Hello {data.user.name}! This is session {data.id}.</Heading>

<div class="flex">
	{#each [1, 2, 3, 5, 8, 13] as vote}
		<Button bind:this={button[vote]} on:click={() => ($user.vote = vote)}>{vote}</Button>
	{/each}
</div>

<CardDisplay
	cards={{
		[data.user.name]: $user.vote,
		...$users
			.filter(({ id }) => id !== $user.id)
			.reduce((acc, { name, vote }) => ({ ...acc, [name]: vote }), {}),
		...range(20).reduce((acc, i) => ({ ...acc, [i]: random(13, false) }), {})
	}}
/>
