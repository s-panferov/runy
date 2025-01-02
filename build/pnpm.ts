import { getPackage, file, target } from "@runy-build/schema";

const mod = getPackage(import.meta);

export const pnpm = target(mod, "pnpm", (ctx) => {
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
