<script lang="ts">
  import { onMount } from 'svelte';
  import {
    initialize,
    tasks as databaseTasks,
  } from '../helpers/database';
  import tasks from '../helpers/tasks';
  import Navigation from '../components/Navigation.svelte';
  import PendingTasks from '../views/Tasks/PendingTasks.svelte';
  import CompltedTasks from '../views/Completed/CompletedTasks.svelte';
  import History from '../views/History/History.svelte';
  import Data from '../views/Data/Data.svelte';
	import About from '../views/About/About.svelte';

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
  <Data />
  <About />
</div>
<br />
