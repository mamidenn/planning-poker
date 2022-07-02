<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Barchart from './Barchart.svelte';
</script>

<Meta
	title="Barchart"
	component={Barchart}
	argTypes={{
		bars: {}
	}}
/>

<Template let:args>
	<Barchart {...args} />
</Template>

<Story name="Foo" args={{ bars: { S: 3, M: 2, L: 5, XL: 1 } }} />
