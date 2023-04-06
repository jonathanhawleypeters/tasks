<script lang="ts">
	import type { SyncMode } from "../helpers/types";

  export let mode: SyncMode;
</script>

{#if mode === null}
  <p>
    Two devices can sync task data. Syncing is initiated manually.
  </p>
  <p>
    Syncing sends data both ways and cannot be undone.
  </p>
  <p>
    To initiate a connection between two devices, copy an id from one device to another. ids are one-time-use.
  </p>
{/if}