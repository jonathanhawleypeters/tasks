import history, { type Action } from './history';
import tasksStore from './tasks';
import syncState from './syncState';

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
      // this was used to re-initialized tasks in the database
      // mergeExternalActions([], updateTasks);
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
            completedAt: undefined,
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

export const mergeExternalActions = (actions: Action[]) => {
  const transaction = db?.transaction([HISTORY, TASKS], "readwrite");

  if (!transaction) return;

  transaction.onerror = () => {
    // is this enough to catch everything?
    syncState.update(() => ({ status: "errored", errorMessage: transaction.error?.message }))
  }

  const taskStore = transaction.objectStore(TASKS);
  const historyStore = transaction.objectStore(HISTORY);
  
  let addedActionsCount = 0;
  let updatedActions: Action[] = [];

  const insertActions = () => {
    if (actions.length === 0) {
      // a hack to rebuild tasks by passing an empty array of actions
      addedActionsCount--;
      handleActionCount();
    } else {
      actions.forEach(action => {
        const request = historyStore.add(action)
          // adding actions that already exist probably isn't succeeding
          // need another way to track this
        request.onsuccess = handleActionCount;
      });
    }
  };

  const handleActionCount = () => {
    addedActionsCount++;

    if (addedActionsCount !== actions.length) return;

    // get all actions
    const request = historyStore.getAll();

    request
      .onsuccess = () => {
        updatedActions = request.result as Action[];
        const tasks = new Map<number, Task>();

        updatedActions.forEach(action => {
          switch(action.type) {
            case ActionType.add: {
              tasks.set(action.id, {
                description: action.description as string,
                createdAt: action.id,
                completed: false,
              });
              return;
            }
            case ActionType.update: {
              tasks.set(action.id, {
                ...tasks.get(action.id) as Task,
                description: action.description as string,
              });
              return;
            }
            case ActionType.complete: {
              tasks.set(action.id, {
                ...tasks.get(action.id) as Task,
                completedAt: action.timestamp,
                completed: true,
              });
              return;
            }
            case ActionType.uncomplete: {
              tasks.set(action.id, {
                ...tasks.get(action.id) as Task,
                completedAt: undefined,
                completed: false,
              });
              return;
            }
            case ActionType.delete: {
              tasks.delete(action.id);
              return;
            }
            case ActionType.schedule: {
              console.warn("scheduling tasks not implemented", action.id);
              return;
            }
            default: {
              console.error("unknown action type", action.type, action);
              return;
            }
          }
        });

        const updatedTasks = Array.from(tasks.values());

        updatedTasks
          .forEach(task => {
            taskStore.add(task);
          });

        history.initialize(updatedActions);
        tasksStore.initialize(updatedTasks);
        syncState.update(() => ({ status: "finished" }))
        // update task store
      }
    // build tasks out of actions
  }

  // avoid clearing taskstore unless necessary
  // maybe it's just not
  taskStore.clear()
    .onsuccess = insertActions;
}

export const tasks = (resolve: (tasks: Task[]) => void) => {
  if (!db) return;

  db.transaction([TASKS], "readonly")
    .objectStore(TASKS)
    .getAll()
    // @ts-expect-error typescript is wrong
    .onsuccess = (event) => resolve(event.target.result);
}

export const historyRows = (resolve: (actions: Action[]) => void) => {
  if (!db) return;

  db.transaction([HISTORY], "readonly")
    .objectStore(HISTORY)
    .getAll()
    // @ts-expect-error typescript is wrong
    .onsuccess = (event) => resolve(event.target.result);
};
