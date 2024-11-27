import { Actions, Inputs, Outputs } from "./index";

import { BuildContext } from "./context";
import { BuildRef } from "./build";
import { Query } from "./output";
import { Schema } from "./schema";
import { BuildSpec, BuildSpecFactory } from "./spec";
import { BuildFile } from "./buildfile";
import { dynamic } from "./missing";
import { hash } from "./hash";

export interface SpecT {
  In: Inputs;
  Out: Outputs;
  InOut: Outputs;
  Ready: Outputs;
}

export type TargetT = SpecT & {
  Actions: Actions;
};

export type AnySpecT = {
  In: {};
  Out: {};
  InOut: {};
  Ready: {};
};

export type AnyTargetT = AnySpecT & {
  Actions: {};
};

export type IsTrue<T extends 1> = T;

type _AnyTargetCheck = IsTrue<AnyTargetT extends TargetT ? 1 : 0>;

const READY_CACHE = Symbol();
const OUT_CACHE = Symbol();

export class Target<const T extends TargetT> {
  buildfile: BuildFile;
  name: string;

  factory: BuildSpecFactory<T>;
  default: boolean = false;

  hash: string;

  actions: T["Actions"] = {} as T["Actions"];

  static action<const T extends TargetT, K extends string>(
    target: Target<T>,
    action: K,
    actionTarget: Target.Any
  ) {
    (target.actions as Actions)[action] = actionTarget;
  }

  static any<A extends TargetT>(target: Target<A>): Target.Any {
    return target as unknown as Target.Any;
  }

  constructor(
    buildfile: BuildFile,
    name: string,
    factory: BuildSpecFactory<T>
  ) {
    this.buildfile = buildfile;
    this.factory = factory;
    this.name = name;

    this.hash = hash({
      buildfile: this.buildfile.urlPath,
      factory: this.factory,
      name: this.name,
    });

    buildfile.exportTarget(Target.any(this));
  }

  spec(ctx: BuildContext): BuildSpec<T> {
    let spec = ctx.specs.get(Target.any(this));
    if (!spec) {
      spec = this.factory.call(this, ctx);
      ctx.specs.set(Target.any(this), spec);
    }

    return spec as BuildSpec<T>;
  }

  ready(ctx: BuildContext): Query<T["Ready"]> {
    const spec = this.spec(ctx);
    const build = ((spec as any)[OUT_CACHE] ||= new BuildRef(
      ctx,
      this,
      spec,
      "ready"
    ));

    return dynamic(build) as Query<T["Ready"]>;
  }

  out(ctx: BuildContext): Query<T["Out"]> {
    const spec = this.spec(ctx);
    const build = ((spec as any)[READY_CACHE] ||= new BuildRef(
      ctx,
      this,
      spec,
      "out"
    ));

    return dynamic(build) as Query<T["Out"]>;
  }

  toJSON() {
    return {
      buildfile: this.buildfile.urlPath,
      default: this.default,
      name: this.name,
    };
  }

  toSchema(schema: Schema): object {
    if (!schema.targets[this.hash]) {
      schema.targets[this.hash] = this.toJSON();
    }

    return { kind: "target", $ref: this.hash };
  }
}

export namespace Target {
  export type Any = Target<any>;
}
