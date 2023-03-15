export type Task = {
  description: string;
  createdAt: number;
  completedAt?: number;
  scheduledAt?: number;
  completed: boolean;
};

export type NewTask = Omit<Task, 'completedAt' | 'completed'>;

export enum ActionType {
  add = 'ADD',
  complete = 'COMPLETE',
  uncomplete = 'UNCOMPLETE',
  update = 'UPDATE',
  schedule = 'SCHEDULE',
  delete = 'DELETE',
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
