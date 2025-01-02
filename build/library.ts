import { Package, file, fileset } from "@runy-build/schema";

import { tsconfigBase } from "./tsconfig";
import { pnpm } from "./pnpm";

export function runySDKLibrary(mod: Package) {
  const tsconfig = mod.target("tsconfig", (ctx) => {
    return ctx.inout({
      tsconfig: file("tsconfig.json"),
      base: tsconfigBase.out(ctx),
    });
  });

  const sources = fileset(["src/**/*.ts"]);

  const tsc = mod.target("tsc", (ctx) => {
    return ctx
      .define({
        inp: {
          pnpm: pnpm.out(ctx),
          sources,
          tsconfig: tsconfig.out(ctx),
        },
        out: {
          dist: ctx.outFolder("dist"),
        },
      })
      .command(($) => $`pnpm exec tsc -b`);
  });

  //////////////////////////////////
  const api = mod.target("api", (ctx) => {
    return ctx
      .define({
        inp: {
          pnpm: pnpm.out(ctx),
          tsc: tsc.out(ctx),
          config: file("api-extractor.jsonc"),
        },
        out: {
          types: ctx.outFile("dist/index.d.ts"),
        },
      })
      .command(
        ({ $, inp }) => $`pnpm exec api-extractor run -c ${inp.config.path} -l`
      );
  });

  //////////////////////////////////
  const rollup = mod.target("rollup", (ctx) => {
    return ctx
      .define({
        inp: {
          pnpm: pnpm.out(ctx),
          tsc: tsc.out(ctx),
          config: file("rollup.config.js"),
        },
        out: {
          js: ctx.outFile("dist/index.js"),
          sourcemap: ctx.outFile("dist/index.js.map"),
        },
      })
      .command(
        ({ $, inp: { config } }) => $`pnpm exec rollup -c ${config.path}`
      );
  });

  //////////////////////////////////
  const lib = mod.target("lib", (ctx) => {
    return ctx.inout({
      types: api.out(ctx).types,
      main: rollup.out(ctx),
    });
  });

  return lib;
}
