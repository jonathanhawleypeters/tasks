<script lang="ts">
  import { updateDescription } from '../helpers/database';
  import type { Task } from '../helpers/types';

  export let task: Task;

  let updatedDescription = task.description;
  let input: HTMLDivElement;
  
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!(event.key === 'Enter')) return;

    event.preventDefault();

    // no-op, don't make an entry in the history log
    if (task.description === updatedDescription) return;

    task.description = updatedDescription;
    updateDescription(task.createdAt, updatedDescription);
  }

  const handleInput = () => {
    updatedDescription = (input?.textContent || '');
  }
</script>

<div>
  <div 
    contenteditable
    title="Task description, click to edit"
    on:keydown={handleKeyDown}
    on:input|preventDefault={handleInput}
    bind:this={input}
    bind:textContent={updatedDescription}
  />
  <div class="saveExplanation" hidden={updatedDescription === task.description}>press enter / return / &crarr; key to save</div>
</div>

<style>
  .saveExplanation {
    color: gray;
  }
</style>