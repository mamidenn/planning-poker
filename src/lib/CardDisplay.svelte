<script lang="ts" context="module">
	export type AnimationContext = { duration: number };
</script>

<script lang="ts">
	import { setContext } from 'svelte';

	import { flip } from 'svelte/animate';
	import Card, { type Orientation } from './Card.svelte';
	export let cards: { [user: string]: number } = {};

	const animation: AnimationContext = { duration: 300 };
	setContext<AnimationContext>('animation', animation);

	export let orientation: Orientation = 'faceDown';
	const users = (orientation: Orientation) => {
		const users = Object.keys(cards);
		return orientation === 'faceDown' ? users : users.sort((a, b) => cards[a] - cards[b]);
	};
</script>

<div class="flex flex-wrap gap-2">
	{#each users(orientation) as user (user)}
		<div class="flex flex-col items-center" animate:flip={{ duration: animation.duration }}>
			<Card {orientation} label={cards[user]} />
			<p class="label">{user}</p>
		</div>
	{/each}
</div>
<button on:click={() => (orientation = orientation === 'faceDown' ? 'faceUp' : 'faceDown')}
	>Click me!</button
>

<style lang="postcss">
	.label {
		@apply col-start-1 font-medium text-purple-500 text-end self-center px-2;
	}
</style>
