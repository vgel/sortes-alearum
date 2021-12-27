<script context="module" lang="ts">
  import type { Astragalos } from "./lib/util";
</script>

<script lang="ts">
  export let digit: Astragalos;
</script>

<div aria-label="Astralagoi">
  <img src="/images/astragaloi-{digit}.png" alt={`${digit}`} />
</div>

<style>
  div {
    display: inline-flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 57px;
  }
</style>
