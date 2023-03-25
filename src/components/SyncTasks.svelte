<script lang="ts">
  import { fade } from 'svelte/transition';
  import { start } from '../helpers/syncTasks';
  let copied = false;
  // persist this
  let connectionId = crypto.randomUUID();
  // persist this
  let deviceName = "ignorant_banana";
  // add a setting to automatically sync when both devices are online
  const copyConnectionId = () => {
    try {
      navigator.clipboard.writeText(connectionId);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div id="sync-tasks" class="section">
  <h3>Sync Tasks</h3>

  <button on:click|preventDefault={copyConnectionId}>Copy connection id</button>
  {#if copied}
    <span transition:fade>Copied!</span>
  {/if}
  <input bind:value={connectionId} />
  <p>a random id to coordinate between your devices</p>


  <hr />

  <label for="device-name">Device name</label>
  <input id="device-name" bind:value={deviceName} />

  <hr />
  <button on:click|preventDefault={() => start(deviceName, connectionId)}>Sync todos</button>
</div>