import "@runy-build/runtime";

import { buildfile } from "@runy-build/schema";
import { runtime } from "@runy-build/runtime/runy.build";
import { schema } from "@runy-build/schema/runy.build";

const mod = buildfile(import.meta);

const all = mod.target("all", (ctx) => {
  return ctx.inout({
    runtime: runtime.out(ctx),
    schema: schema.out(ctx),
  });
});

mod.default(all);
