<script lang="ts">
	import { range } from 'lodash';
	export let bars: { [value: string]: number };

	$: maxAmount = Math.max(...Object.values(bars), 0);
</script>

<div class="root" style:--max-amount={maxAmount} style:--num-bars={Object.keys(bars).length}>
	{#each range(maxAmount) as tick}
		<p class="y-axis" style:--tick={tick}>
			{tick + 1}
		</p>
		<div class="tick" style:--tick={tick} />
	{/each}
	{#each Object.entries(bars) as [value, amount], index}
		<div
			class="bar"
			class:invisible={amount === 0}
			style:--amount={amount}
			style:--bar-index={index}
		>
			<div class="inner" />
		</div>
		<p class="x-axis" style:--bar-index={index}>
			{value}
		</p>
	{/each}
</div>

<style lang="postcss">
	.root {
		@apply grid gap-x-2;
		grid-template-rows: repeat(var(--max-amount), auto) max-content;
		grid-template-columns: repeat(calc(var(--num-bars) + 1), max-content);
	}
	.bar {
		@apply w-24 border-2 rounded-t-md border-purple-500 z-10 p-1;
		grid-row: calc(var(--max-amount) - var(--amount) + 1) / span max(var(--amount), 1);
		grid-column-start: calc(var(--bar-index) + 2);
	}
	.bar .inner {
		@apply h-full w-full rounded-t-sm;
	}
	.x-axis {
		@apply text-lg font-semibold text-purple-500 text-center py-2;
		grid-column-start: calc(var(--bar-index) + 2);
		grid-row-start: calc(var(--max-amount) + 1);
	}
	.y-axis {
		@apply col-start-1 font-medium text-purple-500 text-end self-center px-2;
		grid-row-start: calc(var(--max-amount) - var(--tick));
	}
	.tick {
		@apply border-b-2 border-purple-500/20;
		grid-row-start: calc(var(--tick) + 1);
		grid-column: 2 / span var(--num-bars);
	}
</style>
