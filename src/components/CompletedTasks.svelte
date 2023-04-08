<script lang="ts">
  import Task from './Task.svelte';
  import tasks from '../helpers/tasks';
  import { isToday, lastWeekExcludingToday, beforeLastWeek } from '../helpers/dates';

  $: none = !$tasks.some(task => task.completed);
  $: today = $tasks.some(task => task.completed && task.completedAt && isToday(task.completedAt));
  $: lastWeek = $tasks.some(task => task.completed && task.completedAt && lastWeekExcludingToday(task.completedAt));
  $: older = $tasks.some(task => task.completed && task.completedAt && beforeLastWeek(task.completedAt));
</script>

<div id="completed" class="section">
  {#if none}
    <p>Completed tasks can be viewed here.</p>
  {/if}
  {#if today}
    <h3>Today</h3>
    {#each $tasks as task}
      {#if task.completed && task.completedAt && isToday(task.completedAt)}
        <Task task={task} />
      {/if}
    {/each}
  {/if}
  {#if lastWeek}
    <details open>
      <summary><h3>Within the last seven days</h3></summary>
      {#each $tasks as task}
        {#if task.completed && task.completedAt && lastWeekExcludingToday(task.completedAt)}
          <Task task={task} />
        {/if}
      {/each}
    </details>
  {/if}
  {#if older}
    <details>
      <summary><h3>Older</h3></summary>
      {#each $tasks as task}
        {#if task.completed && task.completedAt && beforeLastWeek(task.completedAt)}
          <Task task={task} />
        {/if}
      {/each}
    </details>
  {/if}
</div>

<style>
  h3 {
    display: inline-block;
    font-size: 1em;
    margin-block-start: 0.5em;
    margin-block-end: 0.2em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: initial;
  }
</style>