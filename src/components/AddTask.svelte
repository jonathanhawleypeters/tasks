<script lang="ts">
  import { addTask as addTaskToDatabase } from '../helpers/database';
  import type { Task } from '../helpers/types';
  import tasks from '../helpers/tasks';

  let task: Task = {
    description: '',
    createdAt: 0,
    completed: false,
  };

  const submitTask = () => {
    const createdAt = Date.now();
    const newTask = {
      ...task,
      createdAt,
    };
    task = {
      description: '',
      createdAt: 0,
      completed: false,
    };
    tasks.addTask(newTask);
    addTaskToDatabase(newTask.description);
  }
</script>

<form id="add-task" on:submit|preventDefault={submitTask}>
  
  <input bind:value={task.description} id="add-task-field" type="text" />
  <button disabled={task.description === ''} on:click={submitTask}><label for="add-task-field" >Add task</label></button>
</form>

<style>
  label {
    display: block;
  }
  #add-task {
    margin-bottom: 8px;
  }
</style>