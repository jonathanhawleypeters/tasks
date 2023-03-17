<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import type { NewTask, Task } from '../helpers/types';
  import Navigation from '../components/Navigation.svelte';
  import AddTask from '../components/AddTask.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import History from '../components/History.svelte'
  import { complete, uncomplete, deleteTask, localStorageIsSupported } from '../helpers/history';
  import { stateFromLocalStorage } from '../helpers/state';
  import { chatbuttonclick } from '../webrtc/common.js';
  import { clickcreateoffer, clickoffersent, clickanswerpasted } from '../webrtc/offering.js';
  import { clickofferpasted } from '../webrtc/answering.js';

  export const prerender = true;

  let tasks = stateFromLocalStorage();

  const addTask = (task: Task) => tasks = [...tasks, task]; 

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
      addTask={addTask}
    />
    <CompltedTasks
      tasks={tasks}
      uncompleteTask={uncompleteTask}
      deleteTask={removeTask}
    />
    <History />
    <div id="web-rtc-test" class="section">
      <h1>webrtc without signaling server demo.</h1>

      <div id="chatlog" class="chatlog"></div>
      <input id="chatinput" type="text"  placeholder="type here" disabled>
      <button id="chatbutton" on:click={chatbuttonclick} disabled>send</button>

      <hr />
      <p>
      offering a connection to a peer
      </p>

      <p>
      <button id="buttoncreateoffer" on:click={clickcreateoffer}>create offer</button>
      </p>

      <span id="spanoffer" class="invisible">
      <p>
      please copy the offer below and send it to a peer.
      </p>
      <textarea id="textoffer" readonly
        placeholder="please wait a few seconds"></textarea>
      <button id="buttonoffersent" on:click={clickoffersent} disabled>offer sent</button>
      </span>

      <span id="spananswer" class="invisible">
      <p>
      please wait for peer to give answer and paste it below
      </p>
      <textarea id="textanswer"
        placeholder="please paste answer from peer"></textarea>
      <button id="buttonanswerpasted" on:click={clickanswerpasted}>answer pasted</button>
      </span>
      <hr />
      <p>
      answering to a connection offer from a peer
      </p>
      <p>
      please wait for peer to give offer and paste it below
      </p>
      <textarea id="textoffer"
        placeholder="please paste offer from peer"></textarea>
      <button id="buttonofferpasted" on:click={clickofferpasted}>offer pasted</button>

      <span id="spananswer" class="invisible">
      <p>
      please send following answer to peer
      </p>
      <textarea id="textanswer" readonly
        placeholder="please wait a few seconds"></textarea>
      </span>
        
    </div>
  </div>

</main>

<style>
  main {
    padding: 16px;
    width: var(--section-width);
    max-width: 95vw;
    /* 32px is double the padding value */
    height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
</style>
