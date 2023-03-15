<script lang="ts">
	import type { CompleteTask, DeleteTask, Task } from '../helpers/types';
  import PendingTask from './PendingTask.svelte';

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
      <PendingTask
        task={task}
        completeTask={completeTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
</div>