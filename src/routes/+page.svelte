<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import type { NewTask, Task } from '../helpers/types';
  import Navigation from '../components/Navigation.svelte';
  import AddTask from '../components/AddTask.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import History from '../components/History.svelte'
  import { add, complete, uncomplete, deleteTask, localStorageIsSupported } from '../helpers/history';
  import { stateFromLocalStorage } from '../helpers/state';

  let tasks = stateFromLocalStorage();

  const updateTasks = (newTasks: Task[]) => tasks = newTasks; 

  const removeTask = (task: Task) => {
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

  {#if !localStorageIsSupported()}
    <p>Your browser does not appear to support localStorage. Tasks will not be saved between when you close the page.</p>
  {/if}

  <div class="sections-container">
    <PendingTasks
      tasks={tasks}
      completeTask={completeTask}
      deleteTask={removeTask}
      updateTasks={updateTasks}
    />
    <CompltedTasks
      tasks={tasks}
      uncompleteTask={uncompleteTask}
      deleteTask={removeTask}
    />
    <History />
  </div>

</main>
