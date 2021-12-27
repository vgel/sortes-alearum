<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";

  import AstragalosDisplay from "./Astragalos.svelte";
  import Card from "./Card.svelte";
  import { Astragalos, astragalosSucc, randomAstragalos } from "./lib/util";

  let digits: Astragalos[] = Array(5).fill(1);
  /**
   * If the index of a digit is < this number, it's considered done rolling.
   * Its value is fixed and it won't animate anymore.
   * This value *can* be negative, it just means it takes longer to tick up to completion.
   */
  let digitsFinishedRolling = 0;
  /**
   * A reactive value that is true when `digitsFinishedRolling` is >= `digits.length`,
   * meaning all digits are finished rolling.
   */
  let finishedRolling: boolean;
  $: finishedRolling = digitsFinishedRolling >= digits.length;

  /** The returned handle from the dice-rolling setInterval */
  let timerHandle: ReturnType<typeof setInterval> | undefined = undefined;
  function clearTimerHandle() {
    if (timerHandle !== undefined) {
      clearInterval(timerHandle);
    }
  }
  onDestroy(() => clearTimerHandle());

  /** This event will be fired when `finishedRolling` becomes true */
  let eventDispatcher = createEventDispatcher<{
    rolled: Astragalos[];
  }>();

  function startRolling() {
    timerHandle = setInterval(rollStep, 200);
    // 10 steps of all rolling, then 5 steps of iterative stopping
    digitsFinishedRolling = -10;
    digits = digits.map((_) => randomAstragalos());
  }

  function rollStep() {
    if (finishedRolling) {
      clearTimerHandle();
      setTimeout(() => eventDispatcher("rolled", digits), 200);
      return;
    }

    digits = digits.map((d, idx) => (idx < digitsFinishedRolling ? d : astragalosSucc(d)));
    digitsFinishedRolling += 1;
  }
</script>

<Card>
  <div class="container">
    <p>
      “God of the Muses, Hermes, prophet of Apollo, greetings, well-spoken son of Zeus and Maia, Helper in Travels;
      reveal to me in your oracles true divine words”
    </p>
    <div class="astragaloi">
      {#each digits as digit}
        <AstragalosDisplay {digit} />
      {/each}
    </div>
    <div class="roll-container">
      <button disabled={timerHandle !== undefined} on:click={startRolling}>Roll the Astragaloi</button>
    </div>
  </div>
</Card>

<style>
  .container {
    display: flex;
    flex-flow: column nowrap;
  }

  p {
    margin: 0;
  }

  .astragaloi {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    margin: 2em 0;
  }

  .roll-container {
    display: flex;
    place-content: center;
  }

  button {
    font: inherit;
    font-weight: 300;
    padding: 0.25em;
    cursor: pointer;
  }
</style>
