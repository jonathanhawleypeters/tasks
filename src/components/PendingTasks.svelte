<script lang="ts">
	import type { CompleteTask, DeleteTask, Task } from '../helpers/types';
  import Task from './Task.svelte';

  export let tasks: Task[];
  export let completeTask: CompleteTask;
  export let deleteTask: DeleteTask;

  $: none = !tasks.some(task => !task.completed)
</script>

<div id="current-tasks" class="section">
  {#if none}
    All done!
  {/if}
  {#each tasks as task}
    {#if !task.completed}
      <Task
        task={task}
        checkAction={completeTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
</div>