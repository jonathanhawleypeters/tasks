// Store up all these peers and messages
// persist the WebRTC store using localstorage
import { writable, get } from "svelte/store";
import { browser } from '$app/environment';
import { historyRows, mergeExternalActions } from './database';
import type { Task } from "./types";

type Peer = {
  id: string;
  client_id: string;
}

// peers send all their timestamps
const TIMESTAMPS = "TIMESTAMPS";

// peers reply with actions that are missing from the list of action timestamps
const ACTIONS = "ACTIONS";

const p2pcfOptions = {
  workerUrl: "https://p2pcf.recipes-only.workers.dev/",
  fastPollingRateMs: 2500, // 2.5 seconds
  slowPollingRateMs: 6000, // 6 seconds
  idlePollingAfterMs: 60000, // 1 minute
  idlePollingRateMs: 300000, // 5 minutes
};

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

export const start = async (clientId: string, roomId: string, updateTasks: (tasks: Task[]) => void) => {
  if (!browser) return;

  // replace with peer.js
  const { default: P2PCF } = await import('p2pcf');

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

  p2pcf = new P2PCF(clientId, roomId, p2pcfOptions);
  state.update(() => 'connecting');

  p2pcf.start();

  p2pcf.on('msg', (peer: Peer, data: ArrayBuffer) => {
    try {
      const decodedData = new TextDecoder("utf-8").decode(data);

      const separatorIndex = decodedData.indexOf(':');

      const type = decodedData.slice(0, separatorIndex);
      const json = decodedData.slice(separatorIndex + 1);
  
      const payload = JSON.parse(json);
  
      console.log('message recieved', peer.id, peer.client_id, type, payload);

      switch(type) {
        case ACTIONS: {
          if (!payload.length) return;
          mergeExternalActions(payload, updateTasks);
          return;
        }
        case TIMESTAMPS: {
          handlePeerActions(peer, payload);
          return;
        }
        default: {
          console.error(`unknown message type ${type}`);
        }
      }

    } catch (error) {
      console.error(error);
    }
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

    historyRows((actions) => {
      p2pcf.send(peer, new TextEncoder().encode(`${TIMESTAMPS}:${JSON.stringify(actions.map(action => action.timestamp))}`));
    });

  });
};

const handlePeerActions = (peer: Peer, timestamps: number[]) => {
  const testSet = new Set(timestamps);

  historyRows((actions) => {
    const missingActions = actions.filter(action => !testSet.has(action.timestamp));

    p2pcf?.send(peer, new TextEncoder().encode(`${ACTIONS}:${JSON.stringify(missingActions)}`));
  });
}

