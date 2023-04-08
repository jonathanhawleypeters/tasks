<script lang="ts">
	import { mergeBackupFileActions } from "../../helpers/backup";

  let input: HTMLInputElement;

  let form: HTMLFormElement;

  const handleChange = () => {
    if (!input.files) return;

    mergeBackupFileActions(input.files);

    form.reset();
  }
</script>

<form bind:this={form}>
  <label for="restore-backup">restore backups</label>
  <input id="restore-backup" bind:this={input} on:change={handleChange} type="file" accept=".txt" multiple />
</form>
