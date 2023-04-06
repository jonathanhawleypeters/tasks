<script lang="ts">
	import type { SyncMode } from "../helpers/types";

  export let mode: SyncMode;
</script>

<h3>Sync</h3>
{#if mode === null}
  <p>
    Two devices can sync task data. Syncing is always initiated manually. Once syncing is complete, devices do not store data about each other.
  </p>
  <p>
    Syncing cannot be undone. Data from both devices is merged, and no metadata about where data originated is saved. 
  </p>
  <p>
    To initiate a connection between two devices, copy an id from one device to another. ids are one-time-use–new ids are generated for every sync.
  </p>
{/if}