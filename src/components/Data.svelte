<script lang="ts">
	import type Peer from 'peerjs';
  import Send from './Send.svelte';
	import Recieve from './Recieve.svelte';
	import SyncPreamble from './SyncPreamble.svelte';
  import BackupInput from './BackupInput.svelte';
	import InitiateButtons from './InitiateButtons.svelte';
	import SyncStatus from './SyncStatus.svelte';
	import type { SyncMode } from '../helpers/types';
  import { downloadHistory } from '../helpers/backup';

  let mode: SyncMode = null;

  let peer: Peer | undefined;

  const setPeer = (p?: typeof peer) => {
    if (!p && peer) peer.destroy(); 
    peer = p
  };

  const setMode = (m: SyncMode) => mode = m;
</script>

<div id="data" class="section">
  <h2>Backup</h2>
  <p>Your task data can be downloaded as a text file.</p>
  <button on:click|preventDefault={() => downloadHistory()}>download backup</button>
  <p>One or more of the text files above can be restored.</p>
  <BackupInput />
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