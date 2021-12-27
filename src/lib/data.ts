import { parseAstragaloi, rollCountStr } from "./util";

/** Parsed entry from the data.json file, representing a single oracle response */
export interface OracleEntry {
  roll: string;
  rollDesc: string;
  entity: string;
  text: string[];
}

/** Parse raw JSON data to OracleEntry, and key it by `rollCountStr` for easy access */
function transformData(data: any): Record<string, OracleEntry> {
  if (!Array.isArray(data)) {
    throw new Error("data is not an array!");
  }

  return Object.fromEntries(
    data.map((entry) => {
      let { roll, roll_desc, entity, text } = entry;

      let key = rollCountStr(parseAstragaloi(roll));

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

/** Starts the data fetch, so if it finishes early it can resolve immediately later */
export function preloadData(): Promise<Record<string, OracleEntry>> {
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
