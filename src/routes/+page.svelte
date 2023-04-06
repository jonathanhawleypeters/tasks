<script lang="ts">
  import './page.css';
  import { onMount } from 'svelte';
  import {
    initialize,
    tasks as databaseTasks,
  } from '../helpers/database';
  import tasks from '../helpers/tasks';
  import Navigation from '../components/Navigation.svelte';
  import PendingTasks from '../components/PendingTasks.svelte';
  import CompltedTasks from '../components/CompletedTasks.svelte';
  import History from '../components/History.svelte';
  import SyncTasks from '../components/SyncTasks.svelte';

  onMount(() => {
    // initialize the database
    initialize(() => databaseTasks((dbTasks) => tasks.initialize(dbTasks)));
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
