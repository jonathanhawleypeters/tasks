<script lang="ts">
	import type Peer from 'peerjs';
  import syncState from '../../helpers/syncState';
	import type { SyncMode } from '../../helpers/types';

  export let mode: SyncMode;
  export let setMode: (mode: SyncMode) => void;
  export let setPeer: (peer?: Peer | undefined) => void;

  const handleReset = () => {
    setPeer();
    setMode(null);
    syncState.update(() => ({ status: "awaiting user action" }));
  };
</script>

{#if mode !== null}
  <h3>Status</h3>
  <p>{$syncState.status}</p>
  {#if typeof $syncState.sent === 'number'}
    <p>Sent {$syncState.sent} changes</p>
  {/if}
  {#if typeof $syncState.recieved === 'number'}
    <p>Recieved {$syncState.recieved} changes</p>
  {/if}
  <button on:click|preventDefault={handleReset}>Reset</button>
{/if}
{#if $syncState.status === "errored"}
  <h3>Error message</h3>
  {$syncState.errorMessage}
{/if}