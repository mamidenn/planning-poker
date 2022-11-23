<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const { user, users } = realtime(data.id, data.user);
</script>

<h1>Hello {data.user.name}! This is session {data.id}.</h1>

{#each [1, 2, 3, 5, 8, 13] as vote}
	<button on:click={() => ($user.vote = vote)}>{vote}</button>
{/each}
<table>
	<tr><td>{data.user.name}</td><td>{$user.vote || ''}</td></tr>
	{#each $users.filter((u) => u.id !== $user.id) as { name, vote }}
		<tr><td>{name}</td><td>{vote || ''}</td></tr>
	{/each}
</table>
