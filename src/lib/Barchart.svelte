<script lang="ts">
	import { range } from 'lodash';
	export let bars: { [value: string]: number };

	$: maxAmount = Math.max(...Object.values(bars));
</script>

<div
	class="grid gap-2 h-44 relative"
	style="grid-template-rows: 1fr auto; grid-template-columns: repeat({Object.keys(bars)
		.length},auto)"
>
	<div class="row-start-1 col-span-full relative">
		{#each range(maxAmount + 1) as tick}
			<div
				class="absolute w-full ring-1 ring-purple-900/10"
				style="bottom: {(tick * 100) / maxAmount}%"
			/>
		{/each}
	</div>
	{#each Object.entries(bars) as [value, amount], index}
		<div
			class="border-2 rounded-t-md border-purple-500 bg-gradient-to-br from-purple-500/75 to-cyan-500/75 row-start-1 self-end hover:shadow-xl transition-all z-10"
			style="height: {(amount * 100) / maxAmount}%; grid-column-start: {index + 1}"
		/>
		<p class="text-lg font-semibold text-purple-500 row-start-2 text-center">{value}</p>
	{/each}
</div>
