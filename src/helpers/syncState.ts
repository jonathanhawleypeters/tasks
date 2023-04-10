import { writable } from "svelte/store";

type SyncState = {
  status: "awaiting user action" | "contacting peer server" | "id generated" | "awaiting peer id" | "connected" | "no updates" | "finished" | "errored";
  peerId?: string;
  sent?: number;
  recieved?: number;
  errorMessage?: string;
}

const syncState = writable<SyncState>({ status: "awaiting user action" });

export default syncState;