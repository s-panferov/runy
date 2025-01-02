import { getPackage } from "./package";
import { BuildContext, fileset, flag, Schema } from "./index";

import { z } from "zod";

const shape = z.object({
  a: z.object({
    b: z.object({
      c: z.string(),
    }),
  }),
});

import { describe, expect, test } from "@jest/globals";
import { setWorkspaceRoot } from "./env";

describe("output access", () => {
  test("output access", () => {
    setWorkspaceRoot(import.meta.url);
    const pkg = getPackage(import.meta);

    const f = pkg.flag(Symbol("flag"), flag.option(["wasm"]));

    const a = pkg.target("a", (ctx) => {
      const flag = f.in(ctx);

      return ctx.define({
        inp: {
          files: fileset(["src/**/*"]),
          flag,
        },
        out: {
          data: ctx.data(shape),
          files: fileset(["src/**/*"]),
        },
      });
    });

    const b = pkg.target("b", (ctx) => {
      const a_out = a.out(ctx);
      return ctx.define({
        inp: {
          a: a_out.data.a.b.c,
          b: a_out,
        },
        out: {
          data: ctx.data(shape),
        },
      });
    });

    const schema = Schema.convert(b.out(new BuildContext().with(f.is("wasm"))));
    expect(schema).toMatchSnapshot();
  });
});

// export async function assertSchema(t: Deno.TestContext, value: ToSchema) {
//   const schema = Schema.convert(value);
//   // Deno.writeTextFileSync(
//   const path = join(
//     Deno.env.get("HOME")!,
//     "Workspace",
//     "runy",
//     "packages",
//     "runy-graph",
//     "tests",
//     "schema",
//     t.name + ".json",
//   );
//   Deno.writeTextFileSync(path, JSON.stringify(schema, null, 2));
//   await assertSnapshot(t, schema);
// }
