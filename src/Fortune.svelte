<script lang="ts">
  import AstragalosDisplay from "./Astragalos.svelte";
  import Card from "./Card.svelte";
  import { Astragalos, parseAstragaloi } from "./lib/util";

  export let roll: string;
  export let rollDesc: string;
  export let entity: string;
  export let text: string[];

  let digits: Astragalos[];
  $: digits = parseAstragaloi(roll);

  let fortuneHtml: string;
  $: fortuneHtml = text.map((s) => s.trim()).join(" ");
</script>

<Card>
  <div class="container">
    <div class="astragaloi">
      {#each digits as digit}
        <AstragalosDisplay {digit} />
      {/each}
    </div>
    <p class="roll-desc">{rollDesc}:</p>
    <h2>{@html entity}</h2>
    <p>
      {@html fortuneHtml}
    </p>
  </div>
</Card>

<style>
  .container {
    display: flex;
    flex-flow: column nowrap;
  }

  .astragaloi {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }

  .roll-desc {
    text-align: center;
    font-size: 0.8em;
    margin: 0;
    padding: 1em 0;
    border-bottom: 1px dashed #333;
  }

  h2 {
    margin-bottom: 0;
  }
</style>
