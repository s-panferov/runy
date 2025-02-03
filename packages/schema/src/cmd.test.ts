import { getPackage } from "./package";
import { BuildContext, fileset, Schema } from "./index";
import { describe, expect, test } from "@jest/globals";
import { setWorkspaceRoot } from "./env";

import { z } from "zod";

const shape = z.object({
  a: z.object({
    b: z.object({
      c: z.string(),
    }),
  }),
});

describe("output access", () => {
  test("output access", () => {
    setWorkspaceRoot(import.meta.url);

    const mod = getPackage(import.meta);

    const a = mod.target("a", (ctx) => {
      return ctx
        .in({
          files: fileset(["src/**/*"]),
        })
        .out({
          data: ctx.data(shape),
        })
        .command(
          ({ $, inp: { files }, out: { data } }) =>
            $`my command --in=${files.root} --out=${data.a.b.c}`.sh
        );
    });

    const schema = Schema.convert(a.out(new BuildContext()));
    console.log(schema);

    expect(schema).toMatchSnapshot();
  });
});
