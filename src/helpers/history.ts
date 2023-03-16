import { writable } from "svelte/store";
import { ActionType, type NewTask, type Task, type TaskAction } from "./types";

// a very thorough check from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
export function localStorageIsAvailable() {
  let storage;
  try {
      storage = window.localStorage;
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch (e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

export const localStorageIsSupported = () => {
  const mod = 'task-reminder';
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
}

export const taskHistory = () => localStorage.getItem('history') || '';

const historyStore = writable((localStorageIsSupported() ? taskHistory() : '').split('\n'));

export const history = {
  subscribe: historyStore.subscribe,

  addLine: (line: string) => {
    historyStore.update(lines => {
      const update = [...lines, line];
      if (localStorageIsAvailable()) {
        localStorage.setItem('history', update.join('\n'));
      }
      return update;
    });
  }
}

const formattedUpdate = ({
  type,
  description,
  createdAt,
  scheduledAt,
  completedAt,
}: TaskAction) => {
  // convert all whitespace to single space characters
  // fields are tab dilimited, rows are newline dilimited
  // and todos should be concise, one line descriptions
  const formattedDescription = description?.replace(/\s/g, ' ');
  return `${type}\t${formattedDescription || ''}\t${createdAt}\t${scheduledAt || ''}\t${completedAt || ''}`;
};


export const add = ({
  description,
  createdAt,
  scheduledAt,
}: NewTask) => {
  const update = formattedUpdate({
    type: ActionType.add,
    description,
    createdAt,
    scheduledAt,
  });
  history.addLine(update);
};

export const complete = ({
  createdAt,
}: Task) => {
  const update = formattedUpdate({
    type: ActionType.complete,
    description: '',
    createdAt,
    completedAt: Date.now(),
  });
  history.addLine(update);
};

export const uncomplete = ({
  createdAt,
}: Task) => {
  const update = formattedUpdate({
    type: ActionType.uncomplete,
    createdAt,
  });
  history.addLine(update);
}

export const descriptionUpdate = ({
  createdAt,
  description,
}: Task) => {
  const update = formattedUpdate({
    type: ActionType.update,
    description,
    createdAt,
  });
  history.addLine(update);
};

export const schedule = ({
  createdAt,
  scheduledAt,
}: Task | NewTask) => {
  const update = formattedUpdate({
    type: ActionType.schedule,
    description: '',
    createdAt,
    scheduledAt,
  });
  history.addLine(update);
};

export const deleteTask = ({
  createdAt,
}: Task) => {
  const update = formattedUpdate({
    type: ActionType.delete,
    createdAt,
  });
  history.addLine(update);
};