<script lang="ts">
  import type Peer from 'peerjs';
  import { Html5QrcodeScanner } from "html5-qrcode"
	import { onMount } from 'svelte';
  import { connectToPeer } from '../../helpers/syncTasks';

  export let peer: Peer | undefined;

  let foreignId = '';

  let handleForeignIdSubmit: () => void;


  onMount(() => {
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "scanner",
      { fps: 5, qrbox: {width: 250, height: 250} },
      false, /* verbose= */ 
    );

    handleForeignIdSubmit = () => {
      if (!peer || !foreignId) return;

      // once a scan succeeds, stop scanning
      html5QrcodeScanner.clear();

      connectToPeer(peer, foreignId);
      foreignId = '';
    };

    html5QrcodeScanner.render((decodedText) => {
      foreignId = decodedText;
      handleForeignIdSubmit();
    },
    (error) => {
      console.warn(error);

      // these errors are often that nothing was detected
      // in one frame of scanning
    });
  });
</script>

<form on:submit|preventDefault={handleForeignIdSubmit}>
  <label for="enter-id">Enter id</label>
  <input id="enter-id" bind:value={foreignId}/>
  <button disabled={!peer || !foreignId} type="submit">connect</button>
  <div id="scanner" />
</form>

<style>
  #scanner {
    width: 350px;
  }
</style>
