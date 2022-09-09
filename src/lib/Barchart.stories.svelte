<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Barchart from './Barchart.svelte';
</script>

<Meta
	title="Barchart"
	component={Barchart}
	argTypes={{
		bars: {
			description: 'Bar labels and values'
		}
	}}
/>

<Template let:args>
	<Barchart {...args} />
</Template>

<Story name="T-Shirt Sizes" args={{ bars: { XS: 0, S: 3, M: 2, L: 5, XL: 1 } }} />
