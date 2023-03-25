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

<nav>
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
	<a class:selected={hash === '#sync-tasks'} href="#sync-tasks" on:click|preventDefault={handleSelectView}
		>Sync Tasks</a
	>
	<!-- <a class:selected={hash === '#web-rtc-test'} href="#web-rtc-test" on:click|preventDefault={handleSelectView}
		>WebRTC test</a
	> -->
</nav>

<style>
  nav {
    margin-bottom: 16px;
  }
	a {
		font-size: 1.2rem;
		text-decoration: none;
		color: unset;
	}
  a.selected {
    text-decoration-line: underline !important;
    text-decoration-color: navy;
    text-decoration-thickness: 2px;
  }
</style>
