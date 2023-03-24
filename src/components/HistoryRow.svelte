<script lang="ts">
  import  { typeLabel, dateForDisplay, type Action } from '../helpers/history';
  import { ActionType } from '../helpers/types';
  export let row: Action;
  
  const label = typeLabel(row);
</script>

<tr>
  <td>{label}</td>
  <td>{dateForDisplay(row.timestamp)}</td>
  {#if row.type === ActionType.add || row.type === ActionType.update}
    <td>{row.description}</td>
  {:else}
    <td/>
  {/if}
  <!-- Missing support for schedule -->
</tr>