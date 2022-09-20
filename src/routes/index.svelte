<!-- <script context="module" lang="ts">
	export const prerender = true;
</script> -->
<script lang="ts">
	import { realtime } from '$lib/realtime';
	const { user, users } = realtime('online-users');
	let value = 0;
</script>

<input type="number" bind:value />
<button on:click={() => ($user.vote = value)}>Submit</button>

<table>
	{#each $users as user}
		<tr><td>{user.name}</td><td>{user.vote}</td></tr>
	{/each}
</table>
