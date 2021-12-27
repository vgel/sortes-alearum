<section>
  <slot />
</section>

<style>
  section {
    --background-layer-color: rgba(182, 173, 162, 0.5);
    background: linear-gradient(var(--background-layer-color), var(--background-layer-color)),
      center / cover url("/images/marble.jpg");

    display: flex;
    align-items: stretch;

    padding: 1.5em;
    max-width: 30em;
    min-height: 22em;

    border-radius: 5px;
  }
</style>
