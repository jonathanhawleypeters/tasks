import { browser } from '$app/environment';
import { type DataConnection, Peer } from 'peerjs';
import { historyRows, mergeExternalActions } from './database';
import type { Action } from "./history";
import syncState from './syncState';

type ActionsPayload = {
  type: typeof ACTIONS;
  data: Action[]
}

type TimestampsPayload = {
  type: typeof TIMESTAMPS;
  data: number[]; // action timestamps
}

const onConnection = (connection: DataConnection) => {

  connection.on("open", onOpen(connection));

  connection.on("data", onData(connection));
};

export const startPeerConnection = () => {
  if (browser) {
    syncState.update(() => ({ status: "contacting peer server" }));
    
    const peer = new Peer();
  
    peer.on("error", (e) => syncState.update(() => ({ status: "errored", errorMessage: String(e) })));

    peer.on("open", (id) => {
      syncState.update((state) => (state.status === "awaiting peer id" ? state : { status: "id generated", peerId: id }));
    });

    peer.on("connection", onConnection);

    return peer;
  }
}

// peers send all their timestamps
const TIMESTAMPS = "TIMESTAMPS";

// peers reply with actions that are missing from the list of action timestamps
const ACTIONS = "ACTIONS";


const onOpen = (connection: DataConnection) => () => {
  historyRows((actions) => {
    const payload: TimestampsPayload = {
      type: TIMESTAMPS,
      data: actions.map(action => action.timestamp),
    };
    connection.send(payload);
  });
}

export const connectToPeer = (peer: Peer, peerId: string) => {
  const connection = peer.connect(peerId);
  
  connection.on("open", onOpen(connection));

  connection.on("data", onData(connection));
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

    syncState.update(() => ({ status: "connected", sent: missingActions.length }))
  });
}

const onData = (connection: DataConnection) => (payload: unknown) => {
  try {
    // refine type
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
        const actions = payload.data as Action[];

        syncState.update(() => ({ status: "connected", recieved: actions.length }));

        if (!actions.length) return;
        mergeExternalActions(actions);
        return;
      }
      case TIMESTAMPS: {
        syncState.update(() => ({ status: "connected" }));

        handlePeerActions(connection, payload.data as number[]);
        return;
      }
      default: {
        syncState.update(() => ({ status: "errored", errorMessage: `unknown payload type ${payload.type}` }));
      }
    }

  } catch (error) {
    syncState.update(() => ({ status: 'errored', errorMessage: String(error) }));
  }
};
