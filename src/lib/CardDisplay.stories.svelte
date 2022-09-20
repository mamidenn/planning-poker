<script lang="ts">
	import { Meta, Story, Template } from '@storybook/addon-svelte-csf';
	import CardDisplay from './CardDisplay.svelte';
</script>

<Meta title="CardDisplay" component={CardDisplay} argTypes={{}} />

<Template let:args>
	<CardDisplay {...args} />
</Template>

<Story name="Face Down" args={{ cards: { Martin: 3, Tina: 2, Nic: 2, Timo: 5, Luc: '?' } }} />
