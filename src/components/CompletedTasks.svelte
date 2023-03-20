<script lang="ts">
  import Task from './Task.svelte';
  import { isToday, isWithinOffsetDays } from '../helpers/dates';
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
  <h3>Today</h3>
  {#each tasks as task}
    {#if task.completed && isToday(task.completedAt)}
      <Task
        task={task}
        checkAction={uncompleteTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
  <h3>Within the last seven days</h3>
  {#each tasks as task}
    {#if task.completed && !isToday(task.completedAt) && isWithinOffsetDays(task.completedAt, -7)}
      <Task
        task={task}
        checkAction={uncompleteTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
  <h3>Older</h3>
  {#each tasks as task}
    {#if task.completed && !isWithinOffsetDays(task.completedAt, -7)}
      <Task
        task={task}
        checkAction={uncompleteTask}
        deleteTask={deleteTask}
      />
    {/if}
  {/each}
</div>

<style>
  h3 {
    display: block;
    font-size: 1em;
    margin-block-start: 0.5em;
    margin-block-end: 0.2em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: initial;
    font-family: 'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif;
  }
</style>