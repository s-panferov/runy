import { deadline } from "https://deno.land/std@0.125.0/async/mod.ts";
import { Runa, RunaOptions } from "./client.ts";

export function withDaemon(
  options: RunaOptions,
  testFunc: (daemon: Runa) => Promise<any>
) {
  return async function () {
    const runy = new Runa(options);

    try {
      await deadline(testFunc(runy), 20 * 1000);
    } finally {
      await runy.dispose();
    }
  };
}
