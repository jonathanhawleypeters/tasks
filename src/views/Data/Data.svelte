<script lang="ts">
	import type Peer from 'peerjs';
  import Send from './Send.svelte';
	import Recieve from './Recieve.svelte';
	import SyncPreamble from './SyncPreamble.svelte';
	import InitiateButtons from './InitiateButtons.svelte';
	import SyncStatus from './SyncStatus.svelte';
	import type { SyncMode } from '../../helpers/types';
	import Backup from './Backup.svelte';
	import { onMount } from 'svelte';
	import { connectToPeer, startPeerConnection } from '../../helpers/syncTasks';
	import syncState from '../../helpers/syncState';

  let mode: SyncMode = null;

  let peer: Peer | undefined;

  const setPeer = (p?: typeof peer) => {
    if (!p && peer) peer.destroy(); 
    peer = p
  };

  const setMode = (m: SyncMode) => mode = m;

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");
    if (id) {
      // remove the querystring
      history.replaceState(null, '', location.origin + location.pathname + location.hash);
      mode = "recieve";
      peer = startPeerConnection(() => {
        connectToPeer(peer as Peer, id);
      });
      if (!peer) {
        syncState.update(() => ({ status: "errored", errorMessage: "No PeerJS instance" }));
        return;
      }
    }
  });
</script>

<div id="data" class="section">
  <h2>Backup</h2>
  <Backup />
  <h2>Sync</h2>
  <SyncPreamble mode={mode} />
  {#if mode === 'send'}
    <Send />
  {:else if mode === "recieve"}
    <Recieve peer={peer} />
  {:else} <!-- null -->
    <InitiateButtons setMode={setMode} setPeer={setPeer} />
  {/if}
  <SyncStatus mode={mode} setMode={setMode} setPeer={setPeer} />
</div>