<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';
</script>

<Meta
	title="Card"
	component={Card}
	argTypes={{
		label: { control: 'text' },
		orientation: {
			control: 'select',
			options: ['Face Up', 'Face Down'],
			mapping: { 'Face Up': 'faceUp', 'Face Down': 'faceDown' }
		}
	}}
/>

<Template let:args>
	<Card {...args} />
</Template>

<Story name="Number" args={{ label: '8', orientation: 'Face Up' }} />
<Story name="T-Shirt Size" args={{ label: 'XL', orientation: 'Face Up' }} />
<Story name="Face Down" args={{ label: 'S', orientation: 'Face Down' }} />
