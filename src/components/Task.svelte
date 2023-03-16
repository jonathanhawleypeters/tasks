<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task, UncompleteTask, DeleteTask } from '../helpers/types';
  import Description from './Description.svelte';
  export let task: Task;
  export let checkAction: CompleteTask | UncompleteTask;
  export let deleteTask: DeleteTask;
</script>

<div style="display: flex;" class="task" transition:fade>
  <input checked={task.completed} on:change="{() => checkAction(task)}" type="checkbox">
  <Description task={task} /> 
  <botton class="remove-button" on:click={() => deleteTask(task)} on:keypress={() => deleteTask(task)}>remove</botton>
</div>

<style>
  .task {
    display: flex;
    gap: 8px;
    line-height: 1.7;
  }
  .remove-button {
    text-decoration-line: underline;
    text-decoration-color: red;
    text-decoration-thickness: 1.5px;
  }
  .remove-button:hover {
    cursor: pointer;
  }
  </style>