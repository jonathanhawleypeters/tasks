<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task, UncompleteTask, DeleteTask } from '../helpers/types';
  import Description from './Description.svelte';

  export let task: Task;
  export let checkAction: CompleteTask | UncompleteTask;
  export let deleteTask: DeleteTask;
</script>

<div style="display: flex;" class="task" transition:fade>
  <input title={task.completed ? "Undo complete task" : "Complete task"} checked={task.completed} on:change="{() => checkAction(task)}" type="checkbox">
  <botton title="Delete task" type="button" class="remove-button" on:click={() => deleteTask(task)} on:keypress={() => deleteTask(task)}>🗑️</botton>
  <Description task={task} /> 
</div>

<style>
  .task {
    display: flex;
    gap: 10px;
    line-height: 1.7;
  }
  .remove-button:hover {
    cursor: pointer;
  }
  </style>