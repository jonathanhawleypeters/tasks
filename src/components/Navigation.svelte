<script lang="ts">
	import { onMount } from 'svelte';

	let hash: string;

	function handleSelectView({ target }) {
		const href = target?.getAttribute('href');
		if (!href) return;
		location.hash = href;
	}

	onMount(() => {
		hash = location.hash;

		function locationHashChanged() {
			hash = location.hash;
		}

		window.addEventListener('hashchange', locationHashChanged);
	});
</script>

<div id="navigation">
	<a
		class:selected={hash === '#current-tasks'}
		href="#current-tasks"
		on:click|preventDefault={handleSelectView}>Tasks</a
	>
	<a
		class:selected={hash === '#completed-tasks'}
		href="#completed-tasks"
		on:click|preventDefault={handleSelectView}>Completed</a
	>
	<a class:selected={hash === '#history'} href="#history" on:click|preventDefault={handleSelectView}
		>History</a
	>
</div>

<style>
  #navigation {
    margin-bottom: 16px;
  }
	a {
		text-decoration: none;
		color: unset;
	}
</style>
