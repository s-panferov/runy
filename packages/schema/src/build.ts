import { Compute, Provide, Result } from "./index";

import { BuildContext } from "./context";
import { Schema } from "./schema";
import { BuildSpec } from "./spec";
import { Target, TargetT } from "./target";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM, TO_SCHEMA } from "./symbols";
import { dynamic, DYNAMIC } from "./missing";
import { Output, Query } from "./output";
import { hash } from "./hash";

export type BuildPhase = "out" | "ready";

export class BuildRef<T extends TargetT, P extends BuildPhase>
  implements Compute
{
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: Result<T["Out"]>;
  [PROVIDE_SYM]!: Provide<T["Out"]>;

  hash: string = "";

  private constructor(
    public ctx: BuildContext,
    public target: Target<T>,
    public spec: BuildSpec<T>,
    public phase: P
  ) {}

  static dyn<T extends TargetT, P extends BuildPhase>(
    ctx: BuildContext,
    target: Target<T>,
    spec: BuildSpec<T>,
    phase: P
  ): Query<P extends "out" ? T["Out"] : T["Ready"]> {
    return dynamic(new BuildRef<T, P>(ctx, target, spec, phase)) as Query<
      P extends "out" ? T["Out"] : T["Ready"]
    >;
  }

  computeSchemaObject(schema: Schema) {
    return {
      target: schema.convert(this.target),
      ctx: schema.convert(this.ctx),
      spec: schema.convert(this.spec),
    };
  }

  [TO_SCHEMA] = (schema: Schema): object => {
    let json: object | undefined;
    if (!this.hash) {
      json = this.computeSchemaObject(schema);
      this.hash = hash(json);
    }

    if (!schema.builds[this.hash]) {
      const obj = {} as any;
      schema.builds[this.hash] = obj;
      Object.assign(obj, json || this.computeSchemaObject(schema));
    }

    return { kind: "build", $ref: this.hash, phase: this.phase };
  };

  [DYNAMIC] = (prop: string | symbol) => {
    if (prop == TO_SCHEMA) {
      return this[TO_SCHEMA];
    }

    return Output.dyn(this, prop as string);
  };
}
