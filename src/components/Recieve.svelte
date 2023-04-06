<script lang="ts">
  import type Peer from 'peerjs';
  import { connectToPeer } from '../helpers/syncTasks';

  export let peer: Peer | undefined;

  let foreignId = '';

  const handleForeignIdSubmit = () => {
    if (!peer || !foreignId) return;
    connectToPeer(peer, foreignId);
    foreignId = '';
  };
</script>

<form on:submit|preventDefault={handleForeignIdSubmit}>
  <label for="enter-id">Enter id</label>
  <input id="enter-id" bind:value={foreignId}/>
  <button disabled={!peer || !foreignId} type="submit">connect</button>
</form>
