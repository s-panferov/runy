import { buildfile, file } from "@runy-build/schema";

export const mod = buildfile(import.meta);

export const tsconfigBase = mod.target("tsconfig-base", (ctx) => {
  return ctx.inout({
    base: file("../tsconfig.base.json"),
  });
});
