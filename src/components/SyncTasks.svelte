<script lang="ts">
  import { fade } from 'svelte/transition';
  import { startPeerConnection, connectToPeer } from '../helpers/syncTasks';
  import syncState from '../helpers/syncState';
	import type Peer from 'peerjs';

  let mode: "send" | "recieve" | null = null;

  let copied = false;

  let foreignId = '';

  let peer: Peer | undefined;

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
  const handleGenerateId = () => {
    peer = startPeerConnection();
    if (!peer) {
      syncState.update(() => ({ status: "errored", errorMessage: "No PeerJS instance" }));
      return;
    }
    mode = "send";
  };
  const handleEnterId = () => {
    peer = startPeerConnection();
    if (!peer) {
      syncState.update(() => ({ status: "errored", errorMessage: "No PeerJS instance" }));
      return;
    }
    mode = "recieve";
  };
  const handleForeignIdSubmit = () => {
    if (!peer || !foreignId) return;
    connectToPeer(peer, foreignId);
    foreignId = '';
  };
  const handleReset = () => {
    syncState.update(() => ({ status: "awaiting user action" }));
    mode = null;
  };
</script>

<div id="sync" class="section">
  <h3>Sync</h3>
  <p>
    Two devices can sync task data. Syncing is always initiated manually. Once syncing is complete, devices do not store data about each other.
  </p>
  <p>
    The sync process is non-reversible. Data from both devices is merged, and no metadata about where data originated is saved. 
  </p>
  {#if mode === 'send'}
    <div>
      <button disabled={!$syncState.peerId} on:click|preventDefault={copyConnectionId}>copy</button>
    </div>

    {#if $syncState.peerId}<p>id {$syncState.peerId}</p>{/if}
    {#if copied}
      <span transition:fade>Copied!</span>
    {/if}
  {:else if mode === "recieve"}
    <!-- display input for code, QR scanner -->
    <form on:submit|preventDefault={handleForeignIdSubmit}>
      <label for="enter-id">Enter id</label>
      <input id="enter-id" bind:value={foreignId}/>
      <button disabled={!peer || !foreignId} type="submit">connect</button>
    </form>
  {:else} <!-- null -->
    To initiate a connection between two devices, copy an id from one device to another. ids are one-time-use–new ids are generated for every sync.
    <button on:click|preventDefault={handleGenerateId}>generate id</button>
    <button on:click|preventDefault={handleEnterId}>enter id</button>
  {/if}
  {#if mode !== null}
    <hr />
    <h3>Sync status</h3>
    {$syncState.status}
  {/if}
  {#if $syncState.status === "finished"}
    <button on:click|preventDefault={handleReset}>Reset</button>
  {/if}
  {#if $syncState.status === "errored"}
    <hr />
    <h3>Error message</h3>
    {$syncState.errorMessage}
  {/if}
</div>