<script lang="ts">
	import type { SyncMode } from "../helpers/types";

  export let mode: SyncMode;
</script>

{#if mode === null}
  <p>
    Two devices can sync task data. Syncing is always initiated manually. Devices do not store the information used to make the connection through refreshing the page.
  </p>
  <p>
    Syncing cannot be undone. Data from both devices is merged, and no metadata about where data originated is saved. 
  </p>
  <p>
    To initiate a connection between two devices, copy an id from one device to another. ids are one-time-use. new id random is generated for each device for every sync.
  </p>
{/if}