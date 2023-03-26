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
      return "Mark incomplete";
    case ActionType.update:
      return "Udate description";
    default:
      return `Unexpected action type ${action.type}`;
  }
};

const dateDisplayOptions: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

export const dateForDisplay = (date: number): string => new Date(date)
  .toLocaleDateString(undefined, dateDisplayOptions);

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

export default history;
