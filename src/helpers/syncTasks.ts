// Store up all these peers and messages
// persist the WebRTC store using localstorage
// import { writable } from "svelte/store";
import P2PCF from 'p2pcf';

type Peer = {
  id: string;
  client_id: string;
}

let p2pcf;

export const start = (clientId: string, roomId: string) => {
  p2pcf = new P2PCF(clientId, roomId, {});

  p2pcf.start();

  p2pcf.on('msg', (peer: Peer, data: ArrayBuffer) => {
    console.log('message recieved', peer.id, peer.client_id, new TextDecoder("utf-8").decode(data));
  });

  p2pcf.on('peerclose', (peer: Peer) => {
    console.log('connection closed', peer.id, peer.client_id);
  })

  p2pcf.on('peerconnect', (peer: Peer) => {
    console.log('peer connected', peer.id, peer.client_id);

    // @ts-expect-error typscript is wrong
    p2pcf.send(peer, new TextEncoder().encode("hello"));
  })
};

