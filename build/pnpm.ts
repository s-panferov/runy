import { buildfile, file } from "@runy-build/schema";

export const mod = buildfile(import.meta);

export const pnpm = mod.target("pnpm", (ctx) => {
  return ctx
    .define({
      inp: {
        lockfile: file("../pnpm-lock.yaml"),
        workspace: file("../pnpm-workspace.yaml"),
        package: file("../package.json"),
      },
      out: {
        lockfile: file("../pnpm-lock.yaml"),
        // node_modules??
      },
    })
    .command(($) => $`pnpm install`);
});
