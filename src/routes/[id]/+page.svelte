<script context="module" lang="ts">
	export const prerender = false;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { user, users } = realtime(data.id, data.session);
</script>

<h1>Hello {$user.name}! This is session {data.id}.</h1>

<input type="number" bind:value={$user.vote} />
<table>
	{#each $users as { name, vote }}
		<tr><td>{name}</td><td>{vote || ''}</td></tr>
	{/each}
</table>
