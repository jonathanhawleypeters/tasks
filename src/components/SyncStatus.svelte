<script lang="ts">
  import syncState from '../helpers/syncState';
	import type { SyncMode } from '../helpers/types';

  export let mode: SyncMode;
  export let setMode: (mode: SyncMode) => void;

  const handleReset = () => {
    syncState.update(() => ({ status: "awaiting user action" }));
    setMode(null);
  };
</script>

{#if mode !== null}
  <h3>Status</h3>
  {$syncState.status}
{/if}
{#if $syncState.status === "finished" || $syncState.status === "errored"}
  <button on:click|preventDefault={handleReset}>Reset</button>
{/if}
{#if $syncState.status === "errored"}
  <h3>Error message</h3>
  {$syncState.errorMessage}
{/if}