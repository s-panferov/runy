import { getPackage, file } from "@runy-build/schema";

export const mod = getPackage(import.meta);

export const tsconfigBase = mod.target("tsconfig-base", (ctx) => {
  return ctx.inout({
    base: file("../tsconfig.base.json"),
  });
});
