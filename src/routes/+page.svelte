<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import type { NewTask, Task } from '../helpers/types';
  import Navigation from '../components/Navigation.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import { add, complete, history, uncomplete, deleteTask, localStorageIsSupported } from '../helpers/history';
  import { stateFromLocalStorage } from '../helpers/state';

  let todo: NewTask = {
    description: '',
    createdAt: 0,
  };

  let tasks = stateFromLocalStorage();

  const submitTodo = () => {
    const newTask = {
      ...todo,
      createdAt: Date.now(),
    };
    tasks = [
      ...tasks,
      newTask,
    ];
    todo = {
      description: '',
      createdAt: 0,
    };
    add(newTask);
  }

  const removeTodo = (task: Task) => {
    tasks = tasks.filter((item) => item !== task);
    deleteTask(task);
  }

  const completeTask = (task: Task) => {
    task.completedAt = Date.now();
    task.completed = true;

    tasks = tasks;
    
    complete(task);
  };

  const uncompleteTask = (task: Task) => {
    delete task.completedAt;
    task.completed = false; 
  
    tasks = tasks;

    uncomplete(task);
  };

  onMount(() => {
    // this is stupid, but svelte is broken, so...
    // https://github.com/sveltejs/kit/issues/4216#issuecomment-1067754638
    document.getElementById(location.hash.slice(1))?.scrollIntoView();

    function onIntersectionChange(sections) {
      sections.forEach(section => {
        if (section.isIntersecting) {
          location.hash = `#${section.target.id}`;
        }
      })
    }

    const observer = new IntersectionObserver(onIntersectionChange, {
      root: document.querySelector('.sectionsContainer'),   // default is the viewport
      threshold: .7 // percentage of target's visible area. Triggers "onIntersection"
    })

    for (const section of document.querySelectorAll('.section')) {
      observer.observe(section);
    }      

    return () => observer.disconnect();
  });
</script>

<main>
  <Navigation />

  <form id="add-task" on:submit|preventDefault={submitTodo}>
    <input bind:value={todo.description} id="add-to-do" type="text" placeholder="add task"/>
    <button disabled={todo.description === ''} on:click={submitTodo}>Add</button>
  </form>

  {#if !localStorageIsSupported()}
    <p>Your browser does not appear to support localStorage. Tasks will not be saved between when you close the page.</p>
  {/if}

  <div class="sections-container">
    <PendingTasks
      tasks={tasks}
      completeTask={completeTask}
      deleteTask={removeTodo}
    />
    <CompltedTasks
      tasks={tasks}
      uncompleteTask={uncompleteTask}
      deleteTask={removeTodo}
    />
    <div id="history" class="section">
      {#each $history as row}
        <p>{row}</p>
      {/each}
    </div>
  </div>

</main>

<style>
  #add-task {
    margin: 16px 0;
  }
</style>