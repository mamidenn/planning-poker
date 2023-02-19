<script lang="ts" context="module">
	export type Orientation = 'faceUp' | 'faceDown';
</script>

<script lang="ts">
	import { getContext } from 'svelte';

	import type { TransitionConfig } from 'svelte/transition';
	import { uid } from 'uid';
	import type { AnimationContext } from './CardDisplay.svelte';
	export let label: string | number = '?';
	export let orientation: Orientation = 'faceUp';

	const animation = getContext<AnimationContext>('animation');

	const id = uid();

	const rotate: (node: Element) => TransitionConfig = () => ({
		duration: animation.duration,
		css: (_, u) => `transform: rotateY(${Math.min(0.5, u) * 180}deg);`
	});
</script>

<div class="transition-enforcer">
	{#key orientation}
		<svg xmlns="http://www.w3.org/2000/svg" class="card" transition:rotate|local>
			<defs>
				<linearGradient id={`g${id}`} class="gradient" gradientTransform="rotate(45)">
					<stop offset="0" />
					<stop offset="1" />
				</linearGradient>
				<pattern
					id={`a${id}`}
					patternUnits="userSpaceOnUse"
					width="40"
					height="20"
					patternTransform="rotate(45)"
					stroke="white"
					fill="black"
				>
					<path d="M0 10 l20 -10 l20 10 l0 10 l-20 -10 l-20 10 l0 -10 M20 0 l0 10" />
				</pattern>
				<mask id={`f${id}`}>
					<text
						x="50%"
						y="50%"
						dy=".12em"
						fill="white"
						text-anchor="middle"
						dominant-baseline="middle"
						class="label">{label ?? '?'}</text
					>
				</mask>
				<mask id={`b${id}`}>
					<rect width="100%" height="100%" fill={`url(#a${id})`} />
				</mask>
			</defs>
			<rect
				width="100%"
				height="100%"
				fill={`url(#g${id})`}
				mask={`url(#${(orientation === 'faceUp' ? 'f' : 'b') + id})`}
			/>
		</svg>
	{/key}
</div>

<style lang="postcss">
	.gradient > stop:nth-child(1) {
		stop-color: rgb(var(--color-primary-400));
	}
	.gradient stop:nth-child(2) {
		stop-color: rgb(var(--color-secondary-400));
	}
	.transition-enforcer {
		display: grid;
	}
	.transition-enforcer > * {
		grid-column: 1/2;
		grid-row: 1/2;
	}
	.card {
		@apply w-28 h-44 border-2 border-primary-500 rounded-md shadow-md p-1 overflow-hidden;
	}
	.card .label {
		@apply text-6xl font-semibold;
	}
</style>
