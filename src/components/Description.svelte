<script lang="ts">
  import { updateDescription } from '../helpers/database';
  import type { Task } from '../helpers/types';

  export let task: Task;

  let updatedDescription = task.description;
  let input: HTMLDivElement;
  
  const onUpdateDescription = (event: KeyboardEvent) => {
    if (!(event.key === 'Enter')) return;

    event.preventDefault();

    task.description = updatedDescription;
    updateDescription(task.createdAt, updatedDescription);
  }

  const handleInput = () => {
    updatedDescription = input?.textContent || '';
  }
</script>

<div>
  <div 
    contenteditable
    title="Task description, click to edit"
    on:keydown={onUpdateDescription}
    on:input|preventDefault={handleInput}
    bind:this={input}
    bind:textContent={updatedDescription}
  />
  <div class="saveExplanation" hidden={updatedDescription === task.description}>press enter / return key to save</div>
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
  .saveExplanation {
    color: gray;
  }
</style>