<script lang="ts">
  import history from '../helpers/history';
  import HistoryRow from './HistoryRow.svelte';
</script>

<div id="history" class="section">
  <table >
    <thead>
      <td>Kind</td>
      <td>Time</td>
      <td>Description</td>
    </thead>
    {#each $history as row}
      <HistoryRow row={row} />
    {/each}
  </table>
</div>