<script lang="ts">

  let input: HTMLInputElement;

  const handleChange = () => {
    if (!input.files) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
      let contents = reader.result;
      console.log(contents);
      // validate contents
      // merge actions
    };
  }
</script>

<label for="restore-backup">restore backup</label>
<input id="restore-backup" bind:this={input} on:change={handleChange} type="file" accept=".txt"/>
