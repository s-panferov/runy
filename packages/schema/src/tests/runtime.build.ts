import { getPackage } from "../package";
import { BuildSpec } from "../index";

export const target = () => {
  const mod = getPackage(import.meta);
  return mod.target("target", (spec: BuildSpec, ctx) => {
    spec.in({
      files: spec.fileset(["src/**/*"]),
    });

    spec.out({
      folder: spec.outFolder(),
    });

    spec.out({
      out: spec.runtime("./runtime.rt"),
    });

    return spec;
  });
};
