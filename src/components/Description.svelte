<script lang="ts">
  import { updateDescription } from '../helpers/database';
  import type { Task } from '../helpers/types';

  export let task: Task;

  let editing = false;
  let updatedDescription = task.description;
  const onEdit = () => editing = true;
  const onCancelEdit = () => editing = false;
  const onUpdateDescription = () => {
    task.description = updatedDescription;
    editing = false;
    updateDescription(task.createdAt, updatedDescription);
  }
</script>

<div>
  {#if editing}
    <form on:submit={onUpdateDescription} >
      <input size={updatedDescription.length} autofocus type="text" bind:value={updatedDescription} on:blur={onCancelEdit}/>
    </form>
  {:else}
    <div title="Task description, click to edit" on:click={onEdit} on:keypress={onEdit}><p>{task.description}</p></div>
  {/if}
</div>

<style>
  input {
    all: unset;
  }
  p {
    cursor: pointer;
    margin-block-end: 0;
    margin-block-start: 0;
  }
</style>