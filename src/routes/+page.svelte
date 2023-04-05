<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import {
    initialize,
    tasks as databaseTasks,
  } from '../helpers/database';
  import selectedView from '../helpers/selectedView';
  import tasks from '../helpers/tasks';
  import Navigation from '../components/Navigation.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import History from '../components/History.svelte';
  import SyncTasks from '../components/SyncTasks.svelte';

  onMount(() => {
    // initialize the database
    initialize(() => {
      databaseTasks((dbTasks) => {
        tasks.initialize(dbTasks);
      });
    });
    // this is stupid, but svelte is broken, so...
    // https://github.com/sveltejs/kit/issues/4216#issuecomment-1067754638
    document.getElementById(location.hash.slice(1))?.scrollIntoView();

    function onIntersectionChange(sections: IntersectionObserverEntry[]) {
      sections.forEach(section => {
        if (section.isIntersecting) {
          selectedView.update(`#${section.target.id}`);
        }
      })
    }

    const observer = new IntersectionObserver(onIntersectionChange, {
      root: document.querySelector('.sectionsContainer'),   // default is the viewport
      threshold: .49 // percentage of target's visible area. Triggers "onIntersection"
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
    <PendingTasks />
    <CompltedTasks />
    <History />
    <SyncTasks />
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
