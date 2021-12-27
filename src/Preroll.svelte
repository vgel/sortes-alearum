<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Astragalos, { Digit } from "./Astragalos.svelte";
  import Card from "./Card.svelte";

  let digits: Digit[] = Array(5)
    .fill(0)
    .map((_) => "missing");
  let digitsFinishedRolling = 0;
  let finishedRolling: boolean;
  $: finishedRolling = digitsFinishedRolling >= digits.length;

  let timerHandle: ReturnType<typeof setInterval> | undefined = undefined;

  let eventDispatcher = createEventDispatcher<{
    rolled: number[];
  }>();

  function clearTimerHandle() {
    if (timerHandle !== undefined) {
      clearInterval(timerHandle);
    }
  }

  function startRolling() {
    timerHandle = setInterval(rollStep, 200);
    digitsFinishedRolling = -10;
    digits = digits.map((_) => [1, 3, 4, 6][Math.floor(Math.random() * 4)]);
  }

  function rollStep() {
    if (finishedRolling) {
      clearTimerHandle();
      setTimeout(viewFortune, 200);
      return;
    }

    digits = digits.map((d, idx) => {
      if (idx < digitsFinishedRolling) {
        return d;
      }

      switch (d) {
        case 1:
          return 3;
        case 3:
          return 4;
        case 4:
          return 6;
        case 6:
          return 1;
      }
    });

    digitsFinishedRolling += 1;
  }

  function viewFortune() {
    eventDispatcher(
      "rolled",
      digits.map((d) => {
        if (d == "missing") {
          console.error("rogue missing in digits", digits);
          return 1;
        } else {
          return d;
        }
      })
    );
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
        <Astragalos {digit} />
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
