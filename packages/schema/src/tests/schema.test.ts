import { getPackage } from "../package";
import { BuildContext, BuildSpec, fileset, flag, Schema } from "../index";
import { expect, test, describe } from "vitest";

import { z } from "zod";

const shape = z.object({
  a: z.object({
    b: z.object({
      c: z.string(),
    }),
  }),
});

import { setTestRoot } from "../env";

describe("output access", () => {
  test("output access", () => {
    setTestRoot(import.meta.url);
    const pkg = getPackage(import.meta);

    const f = pkg.flag(Symbol("flag"), flag.option(["wasm"]));

    const a = pkg.target("a", (spec: BuildSpec, ctx) => {
      const flag = f.in(ctx);

      spec.in({
        files: fileset(["src/**/*"]),
        flag,
      });

      spec.out({
        data: spec.data(shape),
        files: fileset(["src/**/*"]),
      });

      return spec;
    });

    const b = pkg.target("b", (spec: BuildSpec, ctx) => {
      const a_out = a.out(ctx);

      spec.in({
        a: a_out.data.a.b.c,
        b: a_out,
      });

      spec.out({
        data: spec.data(shape),
      });

      return spec;
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
