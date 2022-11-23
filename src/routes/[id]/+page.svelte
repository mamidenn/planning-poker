<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { user, users } = realtime(data.id, data.session);
</script>

<h1>Hello {data.session.name}! This is session {data.id}.</h1>

<input type="number" bind:value={$user.vote} />
<table>
	<tr><td>{data.session.name}</td><td>{$user.vote || ''}</td></tr>
	{#each $users.filter((u) => u.id !== $user.id) as { name, vote }}
		<tr><td>{name}</td><td>{vote || ''}</td></tr>
	{/each}
</table>
