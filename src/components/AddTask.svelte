<script lang="ts">
  import { add } from '../helpers/history';
  import type { Task } from '../helpers/types';

  export let addTask: (task: Task) => void;

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
    addTask(newTask);
    add(newTask);
  }
</script>

<form id="add-task" on:submit|preventDefault={submitTask}>
  <input bind:value={task.description} id="add-to-do" type="text" />
  <button disabled={task.description === ''} on:click={submitTask}>Add</button>
</form>

<style>
  #add-task {
    margin-bottom: 8px;
  }
</style>