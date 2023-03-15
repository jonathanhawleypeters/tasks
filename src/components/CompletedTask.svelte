<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { Task, UncompleteTask, DeleteTask } from '../helpers/types';

  export let task: Task;
  export let uncompleteTask: UncompleteTask;
  export let deleteTask: DeleteTask;
</script>

<div style="display: flex;" transition:fade>
  <input checked on:change="{() => uncompleteTask(task)}" type="checkbox">
  <p>{task.description}</p>
  <botton class="remove-button" style="color: red;" on:click={() => deleteTask(task)} on:keypress={() => deleteTask(task)}>remove</botton>
</div>