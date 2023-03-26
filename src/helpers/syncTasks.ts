// Store up all these peers and messages
// persist the WebRTC store using localstorage
import { writable, get } from "svelte/store";
import P2PCF from 'p2pcf';

type Peer = {
  id: string;
  client_id: string;
}

const peerState = writable<Peer[]>([]);

export const peers = {
  subscribe: peerState.subscribe,

  addPeer: (peer: Peer) => {
    peerState.update((state) => [...state, peer]);
  },

  removePeer: (peer: Peer) => {
    peerState.update((state) => state.filter(p => p !== peer));
  }
}

type State =
 | "diconnected"
 | "connecting"
 | "connected"

export const state = writable<State>("diconnected");

let p2pcf;

let compoundKey = '';

export const start = (clientId: string, roomId: string) => {
  if (!clientId || ! roomId) {
    if (p2pcf) p2pcf.destroy();
    return;
  }

  const newKey = `${clientId}-${roomId}`;

  if (compoundKey === newKey) {
    return;
  } else {
    if (p2pcf) p2pcf.destroy();
    compoundKey = newKey;
  }

  p2pcf = new P2PCF(clientId, roomId, { workerUrl: "https://p2pcf.recipes-only.workers.dev/" });
  state.update(() => 'connecting');

  p2pcf.start();

  p2pcf.on('msg', (peer: Peer, data: ArrayBuffer) => {
    console.log('message recieved', peer.id, peer.client_id, new TextDecoder("utf-8").decode(data));
  });

  p2pcf.on('peerclose', (peer: Peer) => {
    peers.removePeer(peer);

    const connected = get(peers).length !== 0;

    if (!connected) {
      state.update(() => "diconnected");
    }
  });

  // find out if WebRTC properties are exposed by p2pcf
  // so that the leading node can initiate syncing
  p2pcf.on('peerconnect', (peer: Peer) => {
    peers.addPeer(peer);
    state.update(() => "connected");

    p2pcf.send(peer, new TextEncoder().encode("hello"));
  });
};

