<script lang="ts">
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


<Navigation />

<div class="sections-container">
  <PendingTasks />
  <CompltedTasks />
  <History />
  <SyncTasks />
</div>
<br />
<a href="/about">about</a>
