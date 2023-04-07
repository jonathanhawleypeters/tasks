<script lang="ts">
  import { fade } from 'svelte/transition';
  import Description from './Description.svelte';
  import tasks from '../helpers/tasks';
  import type { Task } from '../helpers/types';

  export let task: Task;
</script>

<div style="display: flex;" class="task" transition:fade|local>
  <input 
    title={task.completed ? "Undo complete task" : "Complete task"}
    checked={task.completed}
    on:change="{() => task.completed ? tasks.uncompleteTask(task) : tasks.completeTask(task)}"
    type="checkbox"
  />
  <botton title="Delete task" type="button" class="remove-button" on:click={() => tasks.removeTask(task)} on:keypress={() => tasks.removeTask(task)}>🗑️</botton>
  <Description task={task} /> 
</div>

<style>
  input {
    height: 20px;
  }
  .task {
    display: flex;
    gap: 10px;
    line-height: 1.7;
  }
  .remove-button:hover {
    cursor: pointer;
  }
</style>