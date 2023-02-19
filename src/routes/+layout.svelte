<script lang="ts">
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.css';
	import { AppShell, AppBar, menu, LightSwitch } from '@skeletonlabs/skeleton';
	import Icon from 'svelte-awesome/components/Icon.svelte';
	import { user } from 'svelte-awesome/icons';
</script>

<AppShell>
	<svelte:fragment slot="header">
		<AppBar class="shadow-lg">
			<svelte:fragment slot="lead"><strong>Planning Poker</strong></svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
				<span class="relative">
					<button use:menu={{ menu: 'user' }} class="btn-icon variant-filled-secondary p-0">
						<Icon data={user} />
					</button>
					<nav class="list-nav card p-4 w-64 shadow-xl" data-menu="user">
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
		<div class="text-center text-xs p-2 opacity-75">
			Made with love, <a href="https://svelte.dev/">Svelte</a> and
			<a href="https://www.skeleton.dev/">Skeleton</a> by
			<a href="https://github.com/mamidenn">Martin Dennhardt</a>.
		</div>
	</svelte:fragment>
</AppShell>
