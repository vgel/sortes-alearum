const _astragaloi = [1, 3, 4, 6] as const;
export type Astragalos = typeof _astragaloi[number];
export const ASTRAGALOI = _astragaloi as unknown as Astragalos[];

/** Generates URL for astragalos image */
export function astragalosImage(d: Astragalos): string {
  return `/images/astragaloi-${d}.png`;
}

/**
 * Returns a string with rolls mapped to counts:
 * `[1, 1, 3, 4] => 2,1,1,0`
 */
export function rollCountStr(r: Astragalos[]): string {
  // padded with zeros for simplicity
  let counts = [0, 0, 0, 0, 0, 0, 0];
  for (let c of r) {
    counts[c] += 1;
  }
  return ASTRAGALOI.map((c) => counts[c].toString()).join(",");
}

/** Parses a string like "11344" into an array of astragaloi */
export function parseAstragaloi(fr: string): Astragalos[] {
  return fr.split("").flatMap((c) => {
    switch (c) {
      case "1":
        return [1];
      case "3":
        return [3];
      case "4":
        return [4];
      case "6":
        return [6];
    }
    console.error(`unknown char: ${c}`);
    return [];
  });
}

export function randomAstragalos(): Astragalos {
  return ASTRAGALOI[Math.floor(Math.random() * ASTRAGALOI.length)];
}

/** Adds one, skipping and wrapping appropriately, to an astragalos to get the next one. */
export function astragalosSucc(a: Astragalos): Astragalos {
  switch (a) {
    case 1:
      return 3;
    case 3:
      return 4;
    case 4:
      return 6;
    case 6:
      return 1;
  }
}
