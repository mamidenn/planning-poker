<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { realtime } from '$lib/realtime';
	const { user, users } = realtime('online-users');
	let value = 0;
	let name = '';
</script>

<input type="number" bind:value />
<button on:click={() => ($user.vote = value)}>Submit</button>

{#if !$user || !$user.name}
	<input type="text" placeholder="Name" bind:value={name} />
	<button on:click={() => name && ($user = { ...$user, name })}>That's me!</button>
{/if}
<table>
	{#each $users.filter((u) => u.name) as user}
		<tr><td>{user.name}</td><td>{user.vote || ''}</td></tr>
	{/each}
</table>
