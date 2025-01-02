import { getPackage, flag } from "@runy-build/schema";

const mod = getPackage(import.meta);

const platformKey = Symbol("platform");
export const platform = mod.flag(platformKey, flag.option(["wasm32"]));
