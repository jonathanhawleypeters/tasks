<script lang="ts">
  import Task from './Task.svelte';
  import type { DeleteTask, Task, UncompleteTask } from '../helpers/types';

  export let tasks: Task[];
  export let uncompleteTask: UncompleteTask;
  export let deleteTask: DeleteTask;

  $: none = !tasks.some(task => task.completed);
</script>

<div id="completed-tasks" class="section">
  {#if none}
    No completed tasks to display
  {/if}
  {#each tasks as task}
    {#if task.completed}
      <Task
        task={task}
        checkAction={uncompleteTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
</div>