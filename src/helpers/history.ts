import { writable } from "svelte/store";

import { ActionType } from "./types";

export type Action = {
  type: ActionType;
  timestamp: number;
  id: number;
  description?: string;
}

export const typeLabel = (action: Action): string => {
  switch(action.type) {
    case ActionType.add:
      return "Add";
    case ActionType.complete:
      return "Complete";
    case ActionType.delete:
      return "Delete";
    case ActionType.schedule:
      return "Schedule";
    case ActionType.uncomplete:
      return "Mark due";
    case ActionType.update:
      return "Change";
    default:
      return `Unexpected action type ${action.type}`;
  }
};

const historyStore = writable<Action[]>([]);

const history = {
  subscribe: historyStore.subscribe,

  initialize: (lines: Action[]) => {
    historyStore.update(() => lines)
  },

  addLine: (line: Action) => {
    historyStore.update(lines => [...lines, line]);
  }
};

export const actionId = (action: Action) => action.id;

export const actionDate = (action: Action) => new Date(action.timestamp).toISOString().split('T')[0];

export default history;
