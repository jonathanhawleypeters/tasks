<script lang="ts">
  import './page.css';
</script>

<main>
  <slot />
</main>

<style>
  main {
    padding: 16px;
    width: var(--section-width);
    max-width: 95vw;
    /* 48px is double the main padding + the navigation's margin bottom */
    height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
</style>