<script lang="ts">
  import { fade } from 'svelte/transition';
  import QRCode from 'qrcode';
  import syncState from '../../helpers/syncState';

  let copied = false;

  let QRcodeCanvas: HTMLCanvasElement | undefined;

  const renderQRCode = () => {
    if (!$syncState.peerId) return;

    QRCode.toCanvas(
      QRcodeCanvas,
      $syncState.peerId,
      { scale: 6, errorCorrectionLevel: 'H' },
      (error: unknown) => {
        if (!error) return;
        syncState.update(() => ({ status: "errored", errorMessage: String(error) }))
      }
    );
  }

  $: $syncState, renderQRCode();

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
</script>

<div>
  <button disabled={!$syncState.peerId} on:click|preventDefault={copyConnectionId}>copy</button>
</div>
<div>
  {#if $syncState.peerId}
    <p>id {$syncState.peerId}</p>
    {/if}
  {#if copied}
    <span transition:fade|local>Copied!</span>
  {/if}
</div>
<canvas bind:this={QRcodeCanvas} style="width: 100px" />
