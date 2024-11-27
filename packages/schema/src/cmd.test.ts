import { buildfile } from "./buildfile";
import { BuildContext, fileset, Schema } from "./index";

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

    const mod = buildfile(import.meta);

    const a = mod.target("a", (ctx) => {
      return ctx
        .define({
          inp: {
            files: fileset(["src/**/*"]),
          },
          out: {
            data: ctx.data(shape),
          },
        })
        .command(
          ({ $, inp: { files }, out: { data } }) =>
            $`bash -c "my command --in=${files.root} --out=${data.a.b.c}"`
        );
    });

    const schema = Schema.convert(a.out(new BuildContext()));
    console.log(schema);

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
