<script lang="ts">
	import type Peer from 'peerjs';
  import Send from './Send.svelte';
	import Recieve from './Recieve.svelte';
	import InitiateButtons from './InitiateButtons.svelte';
	import SyncStatus from './SyncStatus.svelte';
	import type { SyncMode } from '../helpers/types';
	import SyncPreamble from './SyncPreamble.svelte';

  let mode: SyncMode = null;

  let peer: Peer | undefined;

  const setPeer = (p: typeof peer) => peer = p;

  const setMode = (m: SyncMode) => mode = m;
</script>

<div id="sync" class="section">
  <SyncPreamble mode={mode} />
  {#if mode === 'send'}
    <Send />
  {:else if mode === "recieve"}
    <!-- display input for code, QR scanner -->
    <Recieve peer={peer} />
  {:else} <!-- null -->
    <InitiateButtons setMode={setMode} setPeer={setPeer} />
  {/if}
  <SyncStatus mode={mode} setMode={setMode} />
</div>