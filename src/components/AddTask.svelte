<script lang="ts">
  import type { Task } from '../helpers/types';

  export let updateTasks: (newTasks: Task[]) => void;

  let task: NewTask = {
    description: '',
    createdAt: 0,
  };

  const submitTask = () => {
    const newTask = {
      ...task,
      createdAt: Date.now(),
    };
    task = {
      description: '',
      createdAt: 0,
    };
    updateTasks([
      ...tasks,
      newTask,
    ]);
    add(newTask);
  }
</script>

<form id="add-task" on:submit|preventDefault={submitTask}>
  <input bind:value={task.description} id="add-to-do" type="text" placeholder="add task"/>
  <button disabled={task.description === ''} on:click={submitTask}>Add</button>
</form>

<style>
  #add-task {
    margin-bottom: 8px;
  }
</style>