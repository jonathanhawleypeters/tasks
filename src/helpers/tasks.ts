import { writable } from "svelte/store";

import {
  initialize,
  tasks as databaseTasks,
  completeTask as complete,
  uncompleteTask as uncomplete,
  deleteTask,
} from './database';

import type { Task } from './types';

const tasksStore = writable<Task[]>([]);

const tasks = {
  subscribe: tasksStore.subscribe,

  addTask: (task: Task) => {
    tasksStore.update((state) => [...state, task]);
  },

  initialize: (tasks: Task[]) => {
    tasksStore.update(() => tasks);
  },

  removeTask: (task: Task) => {
    tasksStore.update((state) => state.filter((item) => item !== task));
    deleteTask(task.createdAt);
  },

  completeTask: (task: Task) => {
    task.completedAt = Date.now();
    task.completed = true;

    tasksStore.update((state) => state);

    complete(task.createdAt);
  },

  uncompleteTask: (task: Task) => {
    delete task.completedAt;
    task.completed = false; 

    tasksStore.update((state) => state);

    uncomplete(task.createdAt);
  }
}

export default tasks;
