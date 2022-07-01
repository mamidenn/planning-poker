<script lang="ts">
	import type { TransitionConfig } from 'svelte/transition';
	type Orientation = 'faceUp' | 'faceDown';
	export let label = 'C';
	export let orientation: Orientation = 'faceUp';

	const flip: (node: Element, params: any) => TransitionConfig = (_, { duration = 300 }) => ({
		duration,
		css: (_, u) => `transform: rotateY(${Math.min(0.5, u) * 180}deg)`
	});
</script>

<div class="transition-enforcer">
	{#if orientation === 'faceUp'}
		<div class="card" in:flip out:flip>
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
				<defs>
					<linearGradient id="g" gradientTransform="rotate(45)">
						<stop stop-color="rgb(168 85 247)" />
						<stop stop-color="rgb(6 182 212)" offset="1" />
					</linearGradient>
					<mask id="m">
						<text
							x="50%"
							y="50%"
							dy=".12em"
							fill="white"
							text-anchor="middle"
							dominant-baseline="middle"
							class="text-5xl font-semibold">{label}</text
						>
					</mask>
				</defs>
				<rect width="100%" height="100%" fill="url(#g)" mask="url(#m)" />
			</svg>
		</div>
	{:else}
		<div class="card" in:flip out:flip>
			<div class="h-full w-full rounded-sm bg-card-back-pattern" />
		</div>
	{/if}
</div>

<style>
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
</style>
