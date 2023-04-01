// Store up all these peers and messages
// persist the WebRTC store using localstorage
import { writable, get } from "svelte/store";
import { browser } from '$app/environment';
import { type DataConnection, Peer } from 'peerjs';
import { historyRows, mergeExternalActions } from './database';
import type { Task } from "./types";
import type { Action } from "./history";

type ActionsPayload = {
  type: typeof ACTIONS;
  data: Action[]
}

type TimestampsPayload = {
  type: typeof TIMESTAMPS;
  data: number[]; // action timestamps
}

let id, peer: Peer;

if (browser) {
  id = localStorage.getItem('id');
  
  peer = id ? new Peer(id) : new Peer();
  
  peer.on("open", (identifier) => {
    id = identifier;
    localStorage.setItem('id', id);
  });

  peer.on("connection", (connection) => {
    const peerId = connection.peer;

    connection.on("open", () => {
      peers.addPeer(peerId);

      state.update(() => "connected");

      historyRows((actions) => {
        const payload: TimestampsPayload = {
          type: TIMESTAMPS,
          data: actions.map(action => action.timestamp),
        };
        connection.send(payload);
      });
    });

    connection.on("data", (payload) => {
      try {
        if (!(
          typeof payload === 'object'
          && payload !== null
          && 'type' in payload
          && 'data' in payload
          && typeof payload.type === 'string'
          && Array.isArray(payload.data)
        )) return;

        switch(payload.type) {
          case ACTIONS: {
            if (!payload.data.length) return;
            mergeExternalActions(payload.data as Action[], updateTasks);
            return;
          }
          case TIMESTAMPS: {
            handlePeerActions(connection, payload.data as number[]);
            return;
          }
          default: {
            console.error(`unknown payload type ${payload.type}`);
          }
        }

      } catch (error) {
        console.error(error);
      }
    });

    connection.on("close", () => {
      peers.removePeer(peerId);

      const connected = get(peers).length !== 0;

      if (!connected) {
        state.update(() => "diconnected");
      }
    });
  })
}

// peers send all their timestamps
const TIMESTAMPS = "TIMESTAMPS";

// peers reply with actions that are missing from the list of action timestamps
const ACTIONS = "ACTIONS";

let peerIds: string[] = [];

if (browser) {
  const serializedPeerIds = localStorage.getItem('peerIds');

  if (serializedPeerIds) {
    const parsed = JSON.parse(serializedPeerIds);

    peerIds = parsed;
  }
}

const peerState = writable<string[]>(peerIds);

export const peers = {
  subscribe: peerState.subscribe,

  addPeer: (peerId: string) => {
    peerState.update((state) => {
      if (state.includes(peerId)) return state;

      const updatedState = [...state, peerId];

      localStorage.setItem('peerIds', JSON.stringify(updatedState));
    
      return updatedState;
    });
  },

  removePeer: (peerId: string) => {
    peerState.update((state) => {
      if (!state.includes(peerId)) return state;

      const updatedState = state.filter(id => id !== peerId);

      // though the connection closes, we should remember the peer in localstorage

      return updatedState;
    });
  }
}

type State =
 | "diconnected"
 | "connecting"
 | "connected"

export const state = writable<State>("diconnected");

export const connectToPeer = async (peerId: string, updateTasks: (tasks: Task[]) => void) => {
  if (!peer) return;

  const connection = peer.connect(peerId);

  state.update(() => 'connecting');

  connection.on("open", () => {
    peers.addPeer(peerId);

    state.update(() => "connected");

    historyRows((actions) => {
      const payload: TimestampsPayload = {
        type: TIMESTAMPS,
        data: actions.map(action => action.timestamp),
      };
      connection.send(payload);
    });
  });

  connection.on("data", (payload) => {
    try {
      if (!(
        typeof payload === 'object'
        && payload !== null
        && 'type' in payload
        && 'data' in payload
        && typeof payload.type === 'string'
        && Array.isArray(payload.data)
      )) return;

      switch(payload.type) {
        case ACTIONS: {
          if (!payload.data.length) return;
          mergeExternalActions(payload.data as Action[], updateTasks);
          return;
        }
        case TIMESTAMPS: {
          handlePeerActions(connection, payload.data as number[]);
          return;
        }
        default: {
          console.error(`unknown payload type ${payload.type}`);
        }
      }

    } catch (error) {
      console.error(error);
    }
  });

  connection.on("close", () => {
    peers.removePeer(peerId);

    const connected = get(peers).length !== 0;

    if (!connected) {
      state.update(() => "diconnected");
    }
  });
};

const handlePeerActions = (connection: DataConnection, timestamps: number[]) => {
  const testSet = new Set(timestamps);

  historyRows((actions) => {
    const missingActions = actions.filter(action => !testSet.has(action.timestamp));

    const payload: ActionsPayload = {
      type: ACTIONS,
      data: missingActions,
    };

    connection.send(payload);
  });
}

if (browser && peerIds.length) {
  peerIds.forEach((peerId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    connectToPeer(peerId, () => {});
  });
}
