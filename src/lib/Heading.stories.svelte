<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Heading from './Heading.svelte';
</script>

<Meta title="Heading" component={Heading} argTypes={{}} />

<Template let:args>
	<Heading {...args}>Heading</Heading>
</Template>

<Story name="Heading" />
