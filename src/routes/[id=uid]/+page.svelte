<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	import type { PageServerData } from './$types';
	import CardDisplay from '$lib/CardDisplay.svelte';
	import Button from '$lib/Button.svelte';
	import { random, range } from 'lodash';

	export let data: PageServerData;

	const { user, users } = realtime(data.id, data.user);
</script>

<h1>Hello {data.user.name}! This is session {data.id}.</h1>

{#each [1, 2, 3, 5, 8, 13] as vote}
	<Button on:click={() => ($user.vote = vote)}>{vote}</Button>
{/each}

<CardDisplay
	cards={{
		[data.user.name]: $user.vote,
		...$users
			.filter(({ id }) => id !== $user.id)
			.reduce((acc, { name, vote }) => ({ ...acc, [name]: vote }), {}),
		...range(20).reduce((acc, i) => ({ ...acc, [i]: random(13, false) }), {})
	}}
/>
