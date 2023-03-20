<script lang="ts">
  import { onMount } from "svelte";
  import QRCode from 'qrcode';
  import { Html5QrcodeScanner } from "html5-qrcode"
  import { messages, createOffer, handleOffer } from '../helpers/webrtc.ts';

  let url;

  // const data = '{"type":"answer","sdp":"v=0\r\no=- 8652242820771711625 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=group:BUNDLE 0\r\na=extmap-allow-mixed\r\na=msid-semantic: WMS\r\nm=application 65383 UDP/DTLS/SCTP webrtc-datachannel\r\nc=IN IP4 37.19.210.35\r\na=candidate:519859676 1 udp 2113937151 78eb5616-018c-4705-846c-bc5707d4366e.local 65383 typ host generation 0 network-cost 999\r\na=candidate:1055197873 1 udp 2113942271 644b9cbf-aff6-4cb4-bd63-777b9c53b43f.local 54190 typ host generation 0 network-cost 999\r\na=candidate:309385374 1 udp 1677732095 2a02:6ea0:d70a:2::b59e 54190 typ srflx raddr :: rport 0 generation 0 network-cost 999\r\na=candidate:693018782 1 udp 1677729535 37.19.210.35 65383 typ srflx raddr 0.0.0.0 rport 0 generation 0 network-cost 999\r\na=ice-ufrag:r5gt\r\na=ice-pwd:fek/PodQ74conAuLNOOWxS37\r\na=ice-options:trickle\r\na=fingerprint:sha-256 A1:CC:0F:9E:B9:57:32:A2:13:99:40:16:3D:F7:23:68:90:DB:18:20:9B:9C:81:05:4F:76:EC:4B:7D:16:A6:7F\r\na=setup:active\r\na=mid:0\r\na=sctp-port:5000\r\na=max-message-size:262144\r\n"}';

  let offer;
  let offerQRcodeCanvas;
  let responseQRcodeCanvas;
  let scale = 3;

  let receivedOffer;

  let responseOffer;

  const scaleFactor = 0.5;

  const renderCanvas = (canvas, content: string) => {
    QRCode.toCanvas(canvas, content, { scale, errorCorrectionLevel: 'H' }, (error) => console.error(error));
  }

  const offerConnection = () => {
    createOffer()
      .then(ofr => {
        offer = ofr;
        renderCanvas(offerQRcodeCanvas, offer);
      })
      .catch(error => messages.addLine(String(error)))
  }

  const scanQRCode = () => {
    let html5QrcodeScanner = new Html5QrcodeScanner(
      "scanner",
      { fps: 5, qrbox: {width: 250, height: 250} },
      /* verbose= */ false);
    html5QrcodeScanner.render(async (decodedText) => {
      const response = await handleOffer(decodedText);

      responseOffer = response;

      renderCanvas(responseQRcodeCanvas, responseOffer);

      // hide scanner
      // explain the second step of the handshake: othe machine needs to scan the code
    }, () => {});
  }

</script>

<div id="web-rtc-test" class="section">
  <div>
    <button on:click={offerConnection}>Show connection code</button>
    <button on:click={scanQRCode}>Scan QR code</button>
    {#if offer}
      <button on:click={() => {
        scale = scale + scaleFactor;
        renderCanvas(offerQRcodeCanvas, offer);
      }}>+</button>
      <button on:click={() => {
        scale = Math.max(scale - scaleFactor, 0);
        renderCanvas(offerQRcodeCanvas, offer);
      }}>-</button>
    {/if}
    <div id="scanner" />
  </div>
  <canvas bind:this={offerQRcodeCanvas} style="width: 100px" />
  <canvas bind:this={responseQRcodeCanvas} style="width: 100px" />
  {#each $messages as message}
  <p>{message}</p>
  {/each}
</div>

<style>
  #scanner {
    width: 350px;
  }
</style>