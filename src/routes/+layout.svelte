<script lang="ts">
	export let data: LayoutData;

	import type { Theme } from '$lib/schema';
	import { AppBar, AppShell, LightSwitch, menu } from '@skeletonlabs/skeleton';
	import Icon from 'svelte-awesome/components/Icon.svelte';
	import { caretDown, user } from 'svelte-awesome/icons';
	import '../app.css';
	import type { LayoutData } from './$types';
	import { enhance } from '$app/forms';
	import { update as updateTheme } from '$lib/theme';
	import { theme as themeSchema } from '$lib/schema';

	const themes: { icon: string; label: string; name: Theme }[] = [
		{ icon: '💀', label: 'Skeleton', name: 'skeleton' },
		{ icon: '🤖', label: 'Modern', name: 'modern' },
		{ icon: '🚀', label: 'Rocket', name: 'rocket' },
		{ icon: '🧜‍♀️', label: 'Seafoam', name: 'seafoam' },
		{ icon: '📺', label: 'Vintage', name: 'vintage' },
		{ icon: '🏜️', label: 'Sahara', name: 'sahara' },
		{ icon: '👔', label: 'Hamlindigo', name: 'hamlindigo' },
		{ icon: '💫', label: 'Gold Nouveau', name: 'gold-nouveau' },
		{ icon: '⭕', label: 'Crimson', name: 'crimson' }
	];
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="shadow-lg">
			<svelte:fragment slot="lead"><strong>Planning Poker</strong></svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<span class="relative">
					<button use:menu={{ menu: 'theme' }} class="btn hover:variant-soft-secondary">
						<span>Theme</span><Icon data={caretDown} />
					</button>
					<form
						method="post"
						action="/?/setTheme"
						use:enhance={({ data }) => {
							updateTheme(themeSchema.parse(data.get('theme')));
						}}
					>
						<nav class="card list-nav w-64 p-4 shadow-xl" data-menu="theme">
							<ul>
								{#each themes as t}
									<li>
										<button
											class="h-full w-full"
											class:bg-primary-active-token={t.name === data.theme}
											name="theme"
											value={t.name}
										>
											<span>{t.icon}</span><span>{t.label}</span>
										</button>
									</li>
								{/each}
							</ul>
						</nav>
					</form>
				</span>
				<span class="relative">
					<button use:menu={{ menu: 'user' }} class="btn-icon p-0 hover:variant-soft-secondary">
						<Icon data={user} />
					</button>
					<nav class="card list-nav w-64 p-4 shadow-xl" data-menu="user">
						<ul>
							<li><a href="/logout">Logout</a></li>
						</ul>
					</nav>
				</span>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="footer">
		<div class="p-2 text-center text-xs opacity-75">
			Made with love, <a href="https://svelte.dev/">Svelte</a> and
			<a href="https://www.skeleton.dev/">Skeleton</a> by
			<a href="https://github.com/mamidenn">Martin Dennhardt</a>.
		</div>
	</svelte:fragment>
</AppShell>
