<script lang="ts">
	import type Peer from 'peerjs';
  import syncState from '../../helpers/syncState';
  import { startPeerConnection } from '../../helpers/syncTasks';
	import type { SyncMode } from '../../helpers/types';

  export let setPeer: (peer: Peer | undefined) => void;
  export let setMode: (mode: SyncMode) => void;

  const handleGenerateId = () => {
    const newPeer = startPeerConnection(); 
    if (!newPeer) {
      syncState.update(() => ({ status: "errored", errorMessage: "No PeerJS instance" }));
      return;
    }
    setPeer(newPeer);
    setMode("send");
  };
  const handleEnterId = () => {
    const newPeer = startPeerConnection();
    if (!newPeer) {
      syncState.update(() => ({ status: "errored", errorMessage: "No PeerJS instance" }));
      return;
    }
    setPeer(newPeer);
    setMode("recieve");
    syncState.update(() => ({ status: "awaiting peer id" }));
  };
</script>

<button on:click|preventDefault={handleGenerateId}>generate id</button>
<button on:click|preventDefault={handleEnterId}>enter id</button>