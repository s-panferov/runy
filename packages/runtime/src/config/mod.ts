import { flag } from "@runy-build/schema";

const platformKey = Symbol("platform");
export const platform = flag(import.meta, platformKey, flag.string(["wasm32"]));
