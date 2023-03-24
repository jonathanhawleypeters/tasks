import history, { type Action } from './history';

import { ActionType, type Task } from "./types";

let db: IDBDatabase | void;

const HISTORY = "history";

const TASKS = "tasks";

export const initialize = (onSuccess: () => void) => {
  const request = indexedDB.open("tasks", 1);
  
  request.onerror = (event) => {
    // @ts-expect-error typescript problem
    console.error(`Database error: ${event.target?.errorCode}`);
  };
  
  request.onsuccess = () => {
    db = request.result;

    if (onSuccess) onSuccess();

    historyRows((rows) => {
      history.initialize(rows);
    })
  };
  
  // This event is only implemented in recent browsers
  request.onupgradeneeded = () => {
    const db = request.result;
  
    db.createObjectStore(HISTORY, { keyPath: "timestamp" });
  
    const taskStore = db.createObjectStore(TASKS, { keyPath: "createdAt" });
  
    taskStore.createIndex("description", "description", { unique: false });
  };
}

// add task
export const addTask = (description: string) => {
  const id = Date.now();

  const action: Action = {
    id,
    timestamp: id,
    description,
    type: ActionType.add,
  };

  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  const task: Task = {
    createdAt: action.timestamp,
    description: action.description as string,
    completed: false,
  };

  const insertTask = () => {
    transaction.objectStore("tasks")
      .add(task)
      .onsuccess = () => history.addLine(action);
  };

  transaction.objectStore(HISTORY)
    .add(action)
    .onsuccess = insertTask;
};

// update description

export const updateDescription = (createdAt: number, description: string) => {  
  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  const taskStore = transaction.objectStore(TASKS);

  taskStore
    .get(createdAt)
    .onsuccess = (event) => {
      // @ts-expect-error typscript is wrong
      const task = event.target.result;

      if (!task) return;

      const action: Action = {
        id: createdAt,
        timestamp: Date.now(),
        description,
        type: ActionType.update,
      };

      transaction.objectStore(HISTORY)
        .add(action)
        .onsuccess = () => {
          taskStore.put({
            ...task,
            description,
          }).onsuccess = () => history.addLine(action);
        }
    }
}

// complete task

export const completeTask = (createdAt: number) => {
  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  const taskStore = transaction.objectStore(TASKS);

  taskStore
    .get(createdAt)
    .onsuccess = (event) => {
      // @ts-expect-error typscript is wrong
      const task = event.target.result;

      if (!task) return;

      const action: Action = {
        id: createdAt,
        timestamp: Date.now(),
        type: ActionType.complete,
      };

      transaction.objectStore(HISTORY)
        .add(action)
        .onsuccess = () => {
          taskStore.put({
            ...task,
            completed: true,
            completedAt: action.timestamp,
          })
          .onsuccess = () => history.addLine(action);
        }
    }
}

// un-complete task

export const uncompleteTask = (createdAt: number) => {
  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  const taskStore = transaction.objectStore(TASKS);

  taskStore
    .get(createdAt)
    .onsuccess = (event) => {
      // @ts-expect-error typscript is wrong
      const task = event.target.result;

      if (!task) return;

      const action: Action = {
        id: createdAt,
        timestamp: Date.now(),
        type: ActionType.uncomplete,
      };

      transaction.objectStore(HISTORY)
        .add(action)
        .onsuccess = () => {
          taskStore.put({
            ...task,
            completed: false,
            completedAt: null,
          })
          .onsuccess = () => history.addLine(action);
        }
    }
}

// delete task

export const deleteTask = (createdAt: number) => {
  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  const taskStore = transaction.objectStore(TASKS);

  taskStore
    .get(createdAt)
    .onsuccess = (event) => {
      // @ts-expect-error typscript is wrong
      const task = event.target.result;

      if (!task) return;

      const action: Action = {
        id: createdAt,
        timestamp: Date.now(),
        type: ActionType.delete,
      };

      transaction.objectStore(HISTORY)
        .add(action)
        .onsuccess = () => {
          taskStore.delete(createdAt)
            .onsuccess = () => history.addLine(action);
        }
    }
}

// schedule / update due date / unschedule task

// introduce foreign actions and rebuild state

export const tasks = (resolve: (tasks: Task[]) => void) => {
  if (!db) return;

  db.transaction([TASKS], "readonly")
    .objectStore(TASKS)
    .getAll()
    // @ts-expect-error typescript is wrong
    .onsuccess = (event) => resolve(event.target.result);
}

const historyRows = (resolve: (actions: Action[]) => void) => {
  if (!db) return;

  db.transaction([HISTORY], "readonly")
    .objectStore(HISTORY)
    .getAll()
    // @ts-expect-error typescript is wrong
    .onsuccess = (event) => resolve(event.target.result);
};
