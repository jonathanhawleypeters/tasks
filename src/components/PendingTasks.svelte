<script lang="ts">
  import AddTask from './AddTask.svelte';
  import Task from './Task.svelte';
  import tasks from '../helpers/tasks';
</script>

<div id="current-tasks" class="section">
  <AddTask />
  {#each $tasks as task (task.createdAt)}
    {#if !task.completed}
      <Task task={task} />
    {/if}
  {/each}
</div>

<style>
  /* must change line-height to match the dimensions of the gradient */
  /* #current-tasks {
    background-image: repeating-linear-gradient(transparent 0px, transparent 27px, teal 28px);
  } */
</style>
