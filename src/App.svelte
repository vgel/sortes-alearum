<script lang="ts">
  import About from "./About.svelte";
  import Fortune from "./Fortune.svelte";
  import { astragalos } from "./lib/util";
  import Preroll from "./Preroll.svelte";

  interface Entry {
    roll: string;
    rollDesc: string;
    entity: string;
    text: string[];
  }

  function digitsToRoll(digits: number[] | string): string {
    let chars = Array.isArray(digits) ? digits.map((d) => d.toString()) : digits.split("");
    let counts = {};
    for (let c of chars) {
      counts[c] = (counts[c] || 0) + 1;
    }
    return ["1", "3", "4", "6"].map((c) => (counts[c] || 0).toString()).join("");
  }

  function transformData(data: any): Record<string, Entry> {
    if (!Array.isArray(data)) {
      throw new Error("data is not an array!");
    }

    return Object.fromEntries(
      data.map((entry) => {
        let { roll, roll_desc, entity, text } = entry;
        let key = digitsToRoll(roll);

        return [
          key,
          {
            roll,
            rollDesc: roll_desc,
            entity,
            text,
          },
        ];
      })
    );
  }

  function preloadData(): Promise<Record<string, Entry>> {
    let data = null;
    let promise = fetch("/data.json")
      .then((r) => r.json())
      .then(transformData)
      .then((d) => {
        data = d;
        return d;
      });

    return new Promise((resolve, _reject) => {
      if (data != null) {
        resolve(data);
      } else {
        resolve(promise);
      }
    });
  }

  let preloadedData = preloadData();
  let index = 0;

  function prev() {
    index -= 1;
  }

  function next() {
    index += 1;
  }

  function get(data: any[], index: number): any {
    if (index < 0) {
      index = data.length + index;
    } else if (index >= data.length) {
      index = index % data.length;
    }

    return data[index];
  }

  let entryKey: string | null = null;
</script>

<link rel="preload" as="image" href="/images/athenian_agora.png" />
<link rel="preload" as="image" href="/images/marble.png" />
<svelte:head>
  {#each [1, 3, 4, 6] as d}
    <link rel="preload" as="image" href={astragalos(d)} />
  {/each}
</svelte:head>

<main>
  <section class="fortune">
    <header>
      <h1>
        Sortes Alearum
        <small>“Dice Oracle of Hermes”</small>
      </h1>
    </header>

    {#if window.location.search.includes("enumerateAll")}
      {#await preloadedData then data}
        {#each Object.values(data) as entry}
          <Fortune {...entry} />
          <hr />
        {/each}
      {/await}
    {:else if entryKey == null}
      <Preroll
        on:rolled={({ detail }) => {
          entryKey = digitsToRoll(detail);
        }}
      />
    {:else}
      {#await preloadedData then data}
        <Fortune {...data[entryKey]} />
      {/await}
    {/if}
    <footer>
      <nav>
        <a href="#about">About</a>
      </nav>
    </footer>
  </section>
  <About />
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  section.fortune {
    background: center / cover url("/images/athenian_agora.jpg");
    width: 100vw;
    height: 100vh;

    display: grid;
    grid-template-rows: 1fr auto 1fr;
    align-items: center;
    justify-content: center;
  }

  nav {
    display: flex;
    place-content: center;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    text-decoration: underline;
  }

  h1 {
    text-align: center;
    text-transform: uppercase;
  }

  h1 > small {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 0.4em;
    letter-spacing: 0.25em;
  }
</style>
