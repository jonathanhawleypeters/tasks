<script lang="ts">
	import { onMount } from "svelte";
	import { initialize } from "../helpers/navigation";
	import selectedView from '../helpers/selectedView';

	function handleSelectView({ target }) {
		const href = target?.getAttribute('href');
		if (!href) return;
		selectedView.update(href);
	}

	// initialize returns a cleanup callback to onmount
	onMount(() => initialize());
</script>

<nav>
	<a
		class:selected={$selectedView === '#current-tasks'}
		href="#current-tasks"
		on:click|preventDefault={handleSelectView}>Tasks</a
	>
	<a
		class:selected={$selectedView === '#completed'}
		href="#completed"
		on:click|preventDefault={handleSelectView}>Completed</a
	>
	<a class:selected={$selectedView === '#history'} href="#history" on:click|preventDefault={handleSelectView}
		>History</a
	>
	<a class:selected={$selectedView === '#sync'} href="#sync" on:click|preventDefault={handleSelectView}
		>Sync</a
	>
	<!-- <a class:selected={$selectedView === '#web-rtc-test'} href="#web-rtc-test" on:click|preventDefault={handleSelectView}
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
