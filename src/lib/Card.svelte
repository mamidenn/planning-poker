<script lang="ts" context="module">
	export type Orientation = 'faceUp' | 'faceDown';
</script>

<script lang="ts">
	import { getContext } from 'svelte';

	import type { TransitionConfig } from 'svelte/transition';
	import { uid } from 'uid';
	import type { AnimationContext } from './CardDisplay.svelte';
	export let label: string | number = 'C';
	export let orientation: Orientation = 'faceUp';

	const animation = getContext<AnimationContext>('animation');

	const id = uid();

	const rotate: (node: Element) => TransitionConfig = () => ({
		duration: animation.duration,
		css: (_, u) => `transform: rotateY(${Math.min(0.5, u) * 180}deg)`
	});
</script>

<div class="transition-enforcer">
	{#if orientation === 'faceUp'}
		<div class="card" in:rotate out:rotate>
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
				<defs>
					<linearGradient id={`g${id}`} gradientTransform="rotate(45)">
						<stop stop-color="rgb(168 85 247)" />
						<stop stop-color="rgb(6 182 212)" offset="1" />
					</linearGradient>
					<mask id={`m${id}`}>
						<text
							x="50%"
							y="50%"
							dy=".12em"
							fill="white"
							text-anchor="middle"
							dominant-baseline="middle"
							class="label">{label}</text
						>
					</mask>
				</defs>
				<rect width="100%" height="100%" fill={`url(#g${id})`} mask={`url(#m${id})`} />
			</svg>
		</div>
	{:else}
		<div class="card" in:rotate out:rotate>
			<div class="backface" />
		</div>
	{/if}
</div>

<style lang="postcss">
	.transition-enforcer {
		display: grid;
	}
	.transition-enforcer > * {
		grid-column: 1/2;
		grid-row: 1/2;
	}
	.card {
		@apply flex flex-col justify-center items-center w-24 h-36 border-2 border-purple-500 rounded-md shadow-md p-1;
	}
	.card .label {
		@apply text-5xl font-semibold;
	}
	.card .backface {
		@apply h-full w-full rounded-sm bg-card-back-pattern;
	}
</style>
