<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Login</h1>
<form method="post">
	{#if form?.missing}Set a name, imbecile!{/if}
	<input name="name" type="text" placeholder="Name" />
	<button>Login</button>
</form>
