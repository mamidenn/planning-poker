<script lang="ts" context="module">
	export type AnimationContext = { duration: number };
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	import { flip } from 'svelte/animate';
	import Card, { type Orientation } from './Card.svelte';
	export let cards: { [user: string]: number | undefined } = {};

	const animation: AnimationContext = { duration: 300 };
	setContext<AnimationContext>('animation', animation);

	export let orientation: Orientation = 'faceDown';
	const users = (orientation: Orientation) => {
		const users = Object.keys(cards);
		return orientation === 'faceDown'
			? users
			: users.sort((a, b) => (cards[a] ?? 0) - (cards[b] ?? 0));
	};
</script>

<div class="flex flex-wrap justify-center gap-8">
	{#each users(orientation) as user (user)}
		<div class="space-y-1" animate:flip={{ duration: animation.duration }}>
			<Card {orientation} label={cards[user]} />
			<p class="label">{user}</p>
		</div>
	{/each}
</div>

<style lang="postcss">
	.label {
		@apply font-medium;
	}
</style>
