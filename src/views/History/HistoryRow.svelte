<script lang="ts">
  import  { typeLabel } from '../../helpers/history';
  import { timeForDisplay } from '../../helpers/dates';
  import { type Action, ActionType } from '../../helpers/types';
  export let row: Action;
  
  const label = typeLabel(row);
</script>

<tr>
  <td>{label}</td>
  <td>{timeForDisplay(new Date(row.timestamp))}</td>
  {#if row.type === ActionType.add || row.type === ActionType.update}
    <td>{row.description}</td>
  {:else}
    <td/>
  {/if}
  <!-- Missing support for schedule -->
</tr>

<style>
  td {
    padding: 0 8px 0 8px;
  }
  tr {
    /* text-indent: 8px; */
    vertical-align: top;
  }
  tr td:nth-child(2) {
    white-space: nowrap;
  }
</style>