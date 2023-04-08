<script lang="ts">
  import BackupInput from './BackupInput.svelte';
  import { downloadHistory } from '../../helpers/backup';
</script>

<p>Your task data can be downloaded as a text file.</p>
<button on:click|preventDefault={() => downloadHistory()}>download backup</button>
<p>One or more Tasks backup files can be restored.</p>
<BackupInput />
