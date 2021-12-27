<script lang="ts">
  import About from "./About.svelte";
  import Fortune from "./Fortune.svelte";
  import { preloadData } from "./lib/data";
  import { ASTRAGALOI, astragalosImage, rollCountStr } from "./lib/util";
  import Preroll from "./Preroll.svelte";

  let preloadedData = preloadData();
  // this will be set to a roll count str when the rolling is finished
  let entryKey: string | null = null;
</script>

<link rel="preload" as="image" href="/images/athenian_agora.png" />
<link rel="preload" as="image" href="/images/marble.png" />
<svelte:head>
  {#each ASTRAGALOI.map(astragalosImage) as href}
    <link rel="preload" as="image" {href} />
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
      <!-- debug helper -->
      {#await preloadedData then data}
        {#each Object.values(data) as entry}
          <Fortune {...entry} />
          <hr />
        {/each}
      {/await}
    {:else if entryKey == null}
      <Preroll
        on:rolled={({ detail }) => {
          entryKey = rollCountStr(detail);
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
