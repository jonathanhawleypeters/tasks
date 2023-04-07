export type Task = {
  description: string;
  createdAt: number;
  completedAt?: number;
  scheduledAt?: number;
  completed: boolean;
};

export type NewTask = Omit<Task, 'completedAt' | 'completed'>;

export enum ActionType {
  add = 'A', // add a task
  complete = 'C', // mark a task completed
  uncomplete = 'I', // make a completed task incomplete
  update = 'U', // update the description text
  schedule = 'S', // schedule a task for a date
  delete = 'D', // delete a task
}

export type Action = {
  type: ActionType;
  timestamp: number;
  id: number;
  description?: string;
}

export type TaskAction = {
  type: ActionType;
  description?: string;
  createdAt: number;
  scheduledAt?: number;
  completedAt?: number;
}

type TaskEventHandler = (task: Task) => void;

export type CompleteTask = TaskEventHandler;
export type UncompleteTask = TaskEventHandler;
export type DeleteTask = TaskEventHandler;

export type SyncMode = "send" | "recieve" | null;