<script lang="ts">
	import { range } from 'lodash';
	export let bars: { [value: string]: number };

	$: maxAmount = Math.max(...Object.values(bars));
</script>

<div class="flex flex-row justify-center gap-2 h-44 relative mb-8">
	{#each range(maxAmount + 1) as tick}
		<hr class="absolute w-full" style="bottom: {(tick * 100) / maxAmount}%" />
	{/each}
	{#each Object.entries(bars) as [value, amount]}
		<div class="flex flex-col items-center h-full">
			<div class="h-full w-8 relative">
				<div
					class="w-full border-2 absolute bottom-0 left-0"
					style="top: {100 - (amount * 100) / maxAmount}%"
				/>
			</div>
			<p class="text-lg absolute -bottom-8">{value}</p>
		</div>
	{/each}
</div>
