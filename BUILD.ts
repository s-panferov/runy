import "@runy-build/runtime";

import { getPackage, target } from "@runy-build/schema";
import { runtime } from "@runy-build/runtime/BUILD";
import { schema } from "@runy-build/schema/BUILD";

const pkg = getPackage(import.meta);

const all = target(pkg, "all", (ctx) => {
  return ctx.inout({
    runtime: runtime.out(ctx),
    schema: schema.out(ctx),
  });
});

pkg.default(all);
