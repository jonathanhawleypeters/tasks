<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { CompleteTask, DeleteTask, Task } from '../helpers/types';

  export let task: Task;
  export let completeTask: CompleteTask;
  export let deleteTask: DeleteTask;
</script>

<div style="display: flex;" transition:fade>
  <input on:change="{() => completeTask(task)}" type="checkbox">
  <p>{task.description}</p>
  <botton class="remove-button" style="color: red;" on:click={() => deleteTask(task)} on:keypress={() => deleteTask(task)}>remove</botton>
</div>