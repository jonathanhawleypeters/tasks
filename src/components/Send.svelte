<script lang="ts">
  import { fade } from 'svelte/transition';
  import syncState from '../helpers/syncState';

  let copied = false;

  const copyConnectionId = () => {
    try {
      const id = $syncState.peerId;

      if (!id) return;

      navigator.clipboard.writeText(id);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (error) {
      // reset
      copied = false;
      syncState.update(() => ({ status: "errored", errorMessage: String(error) }));
    }
  }
</script>

<div>
  <button disabled={!$syncState.peerId} on:click|preventDefault={copyConnectionId}>copy</button>
</div>
{#if $syncState.peerId}<p>id {$syncState.peerId}</p>{/if}
{#if copied}
  <span transition:fade>Copied!</span>
{/if}