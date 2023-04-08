<script lang="ts">
  import groupBy from 'lodash/groupBy';
  import history, { actionId, actionDate } from '../../helpers/history';
  import HistoryRow from './HistoryRow.svelte';
	import { dateForDisplay } from '../../helpers/dates';
  import type { Action } from '../../helpers/types';

  $: taskHistory = groupBy($history, actionId);

  const taskDescription = (rows: Action[]) => rows.reduce((acc, row) => row.description ? row.description : acc, '');
</script>

<div id="history" class="section">

  <table>
    <thead>
      <td>Kind</td>
      <td>Time</td>
      <td>Description</td>
    </thead>
    {#each Object.values(taskHistory) as task}
      <tbody>
        <tr>
          <td colspan={3}>
            <h3>
              {taskDescription(task)}
            <h3>
          </td>
        </tr>

        <!-- grouping rows by date -->
        {#each Object.entries(groupBy(task, actionDate)) as [date, rows]}
          <td colspan={3}><i>{dateForDisplay(new Date(Date.parse(date)))}</i></td>
          {#each rows as row}
            <HistoryRow row={row} />
          {/each}
        {/each}
      </tbody>
    {/each}
  </table>
</div>

<style>
  /* the heights of all these sticky elements need to be made consistent across devices */
  /* otherwise there's an icky sliver of space between them */
  thead td {
    position: sticky;
    top: 0px;
    background-color: lightgoldenrodyellow;
    color: #444;
  }
  tbody tr td {
    top: 24px;
    background-color: lightgoldenrodyellow; 
  }

  h3 {
    font-size: 1em;
    margin-block-start: 0.5em;
    margin-block-end: 0.2em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
</style>