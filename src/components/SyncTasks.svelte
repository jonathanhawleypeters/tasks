<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { start, peers, state } from '../helpers/syncTasks';

  export let updateTasks;

  let copied = false;
  // validate and escape deviceName and connectionId
  // persist this
  let connectionId = '';
  // persist this
  let deviceName = '';

  const handleRequestId = () => {
    connectionId = crypto.randomUUID();

    localStorage.setItem('connectionId', connectionId);
  };
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
  const handleConnectionIdInput = (event) => {
    if (!(event?.target instanceof HTMLInputElement)) return;

    connectionId = event.target.value;

    localStorage.setItem('connectionId', connectionId);

  }

  const handleDeviceNameInput = (event) => {
    if (!(event?.target instanceof HTMLInputElement)) return;

    deviceName = event.target.value;

    localStorage.setItem('deviceName', deviceName);
  }

  // onMount look up persisted connection id
  onMount(() => {
    const storedConnectionID = localStorage.getItem('connectionId');
    const storedDeviceName = localStorage.getItem('deviceName');

    if (storedConnectionID) {
      connectionId = storedConnectionID;
    };

    if (storedDeviceName) {
      deviceName = storedDeviceName;
    }

    start(deviceName, connectionId, updateTasks);
  })

  const onBlur = () => {
    start(deviceName, connectionId);
  }
</script>

<div id="sync-tasks" class="section">
  <h3>Sync Tasks</h3>
  <div>
    <button on:click|preventDefault={handleRequestId}>generate</button>
    <button on:click|preventDefault={copyConnectionId}>copy</button>
  </div>
  <!-- perform validations -->
  <label for="connection-id">connection id</label>
  <input id="connection-id" pattern="^[a-zA-Z0-9_-]*$" size={37} bind:value={connectionId} on:input={handleConnectionIdInput} on:blur|preventDefault={onBlur}/>
  {#if copied}
    <span transition:fade>Copied!</span>
  {/if}
  <p>a random id to coordinate between your devices</p>

  <hr />

  <label for="device-name">Device name</label>
  <!-- perform validations -->
  <input pattern="^[a-zA-Z0-9_-]*$" id="device-name" bind:value={deviceName} on:input={handleDeviceNameInput} on:blur|preventDefault={onBlur}/>

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
    <p>{peer.client_id}</p>
  {/each}
</div>