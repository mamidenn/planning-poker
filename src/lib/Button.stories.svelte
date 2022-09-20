<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Button from './Button.svelte';
</script>

<Meta title="Button" component={Button} argTypes={{}} />

<Template let:args>
	<Button {...args} />
</Template>

<Story name="Primary" args={{ label: 'Click me!' }} />
