<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import type { NewTask, Task } from '../helpers/types';
  import {
    initialize,
    tasks as databaseTasks,
    completeTask as complete,
    uncompleteTask as uncomplete,
    deleteTask,
  } from '../helpers/database';
  import Navigation from '../components/Navigation.svelte';
  import AddTask from '../components/AddTask.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import History from '../components/History.svelte';
  import WebRTCdemo from '../components/WebRTCdemo.svelte';
  
  let tasks = [];

  const addTask = (task: Task) => tasks = [...tasks, task]; 

  const removeTask = (task: Task) => {
    tasks = tasks.filter((item) => item !== task);
    deleteTask(task.createdAt);
  }

  const completeTask = (task: Task) => {
    task.completedAt = Date.now();
    task.completed = true;

    tasks = tasks;
    
    complete(task.createdAt);
  };

  const uncompleteTask = (task: Task) => {
    delete task.completedAt;
    task.completed = false; 
  
    tasks = tasks;

    uncomplete(task.createdAt);
  };

  onMount(() => {
    // initialize the database
    initialize(() => {
      databaseTasks((dbTasks) => {
        tasks = dbTasks;
      });
    });
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
      threshold: .5 // percentage of target's visible area. Triggers "onIntersection"
    })

    for (const section of document.querySelectorAll('.section')) {
      observer.observe(section);
    }      

    return () => observer.disconnect();
  });
</script>

<main>
  <Navigation />

  <div class="sections-container">
    <PendingTasks
      tasks={tasks}
      completeTask={completeTask}
      deleteTask={removeTask}
      addTask={addTask}
    />
    <CompltedTasks
      tasks={tasks}
      uncompleteTask={uncompleteTask}
      deleteTask={removeTask}
    />
    <History />
    <!-- <WebRTCdemo /> -->
  </div>

</main>

<style>
  main {
    padding: 16px;
    width: var(--section-width);
    max-width: 95vw;
    /* 48px is double the main padding + the navigation's margin bottom */
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
</style>
