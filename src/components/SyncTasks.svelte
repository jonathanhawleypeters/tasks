<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { connectToPeer, peers, state } from '../helpers/syncTasks';

  export let updateTasks;

  let copied = false;
  // validate and escape deviceName and connectionId
  // persist this
  let connectionId = '';

  let newDeviceId = '';
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

  const addNewDevice = () => {
    if (!newDeviceId) return;
    connectToPeer(newDeviceId, updateTasks);
    newDeviceId = '';
  }

  // onMount look up persisted connection id
  onMount(() => {
    const storedConnectionID = localStorage.getItem('id');

    if (storedConnectionID) {
      connectionId = storedConnectionID;
    };
  });
</script>

<div id="sync-tasks" class="section">
  <h3>Sync Tasks</h3>
  <div>
    <button on:click|preventDefault={copyConnectionId}>copy</button>
  </div>

  <p>device id {connectionId}</p>
  {#if copied}
    <span transition:fade>Copied!</span>
  {/if}

  <form on:submit|preventDefault={addNewDevice}>
    <label for="add-device-id">Add device id</label>
    <input id="add-device-id" bind:value={newDeviceId} />
    <button disabled={newDeviceId.length === 0} type="submit">add</button>
  </form>

  <hr />
  <span>Connected devices</span>
  {#if $state === "connected"}
    💚
  {:else if $state === "connecting"}
    💛
  {:else } 
    💔
  {/if}
  {#each $peers as peer}
    <p>id: {peer}</p>
  {/each}
</div>