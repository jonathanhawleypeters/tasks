<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task, UncompleteTask, DeleteTask } from '../helpers/types';
  import Description from './Description.svelte';
  export let task: Task;
  export let checkAction: CompleteTask | UncompleteTask;
  export let deleteTask: DeleteTask;
</script>

<div style="display: flex;" transition:fade>
  <input checked={task.completed} on:change="{() => checkAction(task)}" type="checkbox">
  <Description task={task} /> 
  <botton class="remove-button" style="color: red;" on:click={() => deleteTask(task)} on:keypress={() => deleteTask(task)}>remove</botton>
</div>