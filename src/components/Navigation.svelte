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
		font-size: 1.2rem;
		font-family: 'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif;
		text-decoration: none;
		color: unset;
	}
  a.selected {
    text-decoration-line: underline !important;
    text-decoration-color: darkorange;
    text-decoration-thickness: 2px;
  }
</style>
