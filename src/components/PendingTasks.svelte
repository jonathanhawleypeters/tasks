<script lang="ts">
	import type { CompleteTask, DeleteTask, Task } from '../helpers/types';
  import AddTask from './AddTask.svelte';
  import Task from './Task.svelte';

  export let tasks: Task[];
  export let completeTask: CompleteTask;
  export let deleteTask: DeleteTask;
  export let addTask: (task: Task) => void;

  $: none = !tasks.some(task => !task.completed)
</script>

<div id="current-tasks" class="section">
  <AddTask addTask={addTask} />
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

<style>
  /* must change line-height to match the dimensions of the gradient */
  /* #current-tasks {
    background-image: repeating-linear-gradient(transparent 0px, transparent 27px, teal 28px);
  } */
</style>
