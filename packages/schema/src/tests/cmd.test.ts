import { getPackage } from "../package";
import { BuildContext, BuildSpec, Schema } from "../index";
import { setTestRoot } from "../env";
import { expect, test, describe } from "vitest";

describe("output access", () => {
  test("output access", () => {
    setTestRoot(import.meta.url);

    const mod = getPackage(import.meta);

    const a = mod.target("a", (spec: BuildSpec, ctx) => {
      spec.in({
        files: spec.fileset(["src/**/*"]),
      });

      spec.out({
        folder: spec.outFolder(),
      });

      spec.cmd(
        ({ $, inp: { files }, out: { folder } }) =>
          $`my command --in=${files.root} --out=${folder.root}`.sh
      );

      return spec;
    });

    const b = mod.target("b", (spec: BuildSpec, ctx) => {
      spec.in({
        folder: a.out(ctx).folder,
      });

      return spec;
    });

    const schema = Schema.convert(b.out(new BuildContext()));
    console.log(schema);

    expect(schema).toMatchSnapshot();
  });
});
