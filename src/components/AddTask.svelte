<script lang="ts">
  import { add } from '../helpers/history';
  import { userAction } from '../helpers/database';
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
    userAction();
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