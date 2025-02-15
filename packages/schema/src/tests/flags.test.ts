import { getPackage } from "../package";
import { BuildContext, BuildSpec, Schema, flag } from "../index";
import { setTestRoot } from "../env";
import { expect, test } from "vitest";

test("flags", () => {
  setTestRoot(import.meta.url);

  const mod = getPackage(import.meta);
  const f1 = mod.flag(Symbol("f1"), flag.string());

  const a = mod.target("a", (spec: BuildSpec, ctx) => {
    spec.out({
      f1: f1.in(ctx),
    });

    return spec;
  });

  const b = mod.target("b", (spec: BuildSpec, ctx) => {
    spec.out({
      a: a.out(ctx.with(f1.is("override"))),
      fi: f1.in(ctx),
    });

    return spec;
  });

  const ctx = new BuildContext().with(f1.is("original"));
  const schema = Schema.convert(b.out(ctx));

  expect(schema).toMatchSnapshot();
});
