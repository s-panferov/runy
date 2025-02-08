import { Actions, Inputs, Outputs } from "./index";

import { BuildContext } from "./context";
import { BuildRef } from "./build";
import { Query } from "./output";
import { Schema, TO_SCHEMA } from "./schema";
import { BuildSpec, BuildSpecFactory } from "./spec";
import { Package } from "./package";
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
  package: Package;
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

  constructor(pkg: Package, name: string, factory: BuildSpecFactory<T>) {
    this.package = pkg;
    this.factory = factory;
    this.name = name;

    this.hash = hash({
      package: this.package.path,
      name: this.name,
    });

    pkg.exportTarget(Target.any(this));
  }

  spec(ctx: BuildContext): BuildSpec<T> {
    let spec = ctx.specs.get(Target.any(this));
    if (!spec) {
      spec = this.factory.call(this, new BuildSpec(), ctx);
      ctx.specs.set(Target.any(this), spec);
    }

    return spec as BuildSpec<T>;
  }

  ready(ctx: BuildContext): Query<T["Ready"]> {
    const spec = this.spec(ctx);
    const build: Query<T["Ready"]> = ((spec as any)[OUT_CACHE] ||= BuildRef.dyn(
      ctx,
      this,
      spec,
      "ready"
    ));

    return build;
  }

  out(ctx: BuildContext): Query<T["Out"]> {
    const spec = this.spec(ctx);
    const build: Query<T["Ready"]> = ((spec as any)[READY_CACHE] ||=
      BuildRef.dyn(ctx, this, spec, "out"));

    return build;
  }

  private toJSON() {
    return {
      package: this.package.path,
      default: this.default,
      name: this.name,
    };
  }

  [TO_SCHEMA](schema: Schema): object {
    if (!schema.targets[this.hash]) {
      schema.targets[this.hash] = this.toJSON();
    }

    return { kind: "target", $ref: this.hash };
  }
}

export namespace Target {
  export type Any = Target<any>;
}

export function target<const T extends SpecT>(
  pkg: Package,
  name: string,
  func: BuildSpecFactory<T>
): Target<T & { Actions: {} }> {
  return new Target(pkg, name, func as any);
}
