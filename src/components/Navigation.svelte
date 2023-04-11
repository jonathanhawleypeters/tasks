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
	<ol>
		<li>
			<a
				class:selected={$selectedView === '#current-tasks'}
				href="#current-tasks"
				on:click|preventDefault={handleSelectView}>Tasks</a
			>
		</li>
		<li>
			<a
				class:selected={$selectedView === '#completed'}
				href="#completed"
				on:click|preventDefault={handleSelectView}>Completed</a
			>
		</li>
		<li>
			<a class:selected={$selectedView === '#history'} href="#history" on:click|preventDefault={handleSelectView}
				>History</a
			>
		</li>
		<li>
			<a class:selected={$selectedView === '#data'} href="#data" on:click|preventDefault={handleSelectView}
				>Data</a
			>
		</li>
		<li>
			<a class:selected={$selectedView === '#about'} href="#about" on:click|preventDefault={handleSelectView}
				>About</a
			>
		</li>
	</ol>
</nav>

<style>
	nav ol {
		padding: 0;
		display: flex;
		list-style: none;
		gap: 8px;
	}
	a {
		font-size: 1.2rem;
		text-decoration: none;
		color: unset;
	}
  a.selected {
    text-decoration-line: underline !important;
    text-decoration-thickness: 2px;
  }
</style>
