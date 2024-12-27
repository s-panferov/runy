import { buildfile, flag } from "@runy-build/schema";

let mod = buildfile(import.meta);

const platformKey = Symbol("platform");
export const platform = mod.flag(
  import.meta,
  platformKey,
  flag.option(["wasm32"])
);
