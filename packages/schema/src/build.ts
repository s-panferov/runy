import { Compute, Provide, Result } from "./index";

import { BuildContext } from "./context";
import { Schema } from "./schema";
import { BuildSpec } from "./spec";
import { Target, TargetT } from "./target";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";
import { DYNAMIC } from "./missing";
import { Output } from "./output";
import { hash } from "./hash";

export type BuildPhase = "out" | "ready";

export class BuildRef<T extends TargetT, P extends BuildPhase>
  implements Compute
{
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: Result<T["Out"]>;
  [PROVIDE_SYM]!: Provide<T["Out"]>;

  hash: string = "";

  constructor(
    public ctx: BuildContext,
    public target: Target<T>,
    public spec: BuildSpec<T>,
    public phase: P
  ) {}

  computeSchemaObject(schema: Schema) {
    return {
      target: this.target.toSchema(schema),
      ctx: this.ctx.toSchema(schema),
      spec: this.spec.toSchema(schema),
    };
  }

  toSchema(schema: Schema): object {
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
  }

  [DYNAMIC](prop: string) {
    const bag = this.phase == "out" ? this.spec.out : this.spec.ready;
    const output = (bag as any)[prop as any];

    if (output) {
      const output = new Output(this, prop as string);
      return output.chain();
    } else {
      throw new Error("Unknown output: " + prop.toString());
    }
  }
}
