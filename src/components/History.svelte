<script lang="ts">
    import { history } from '../helpers/history';
</script>

<div id="history" class="section">
  <p>{$history.length} rows</p>
  {#each $history as row}
    <p>{row}</p>
  {/each}
</div>