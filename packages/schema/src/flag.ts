import { Compute, Package } from "./index";

import { BuildContext, BuildContextModifier } from "./context";
import { Schema } from "./schema";
import {
  COMPUTE_SYM,
  PROVIDE_SYM,
  RESULT_SYM,
  TO_JSON,
  TO_SCHEMA,
} from "./symbols";
import { hash } from "./hash";

export class Flag<const K, const T extends flag.FlagType<unknown>>
  implements Compute
{
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: flag.FlagVar<T>;
  [PROVIDE_SYM]!: flag.FlagVar<T>;

  chain: Compute[] = [];
  key!: K;
  ty!: T;
  package!: Package;

  hash: string;

  constructor(pkg: Package, key: K, ty: T) {
    this.key = key;
    this.ty = ty;
    this.package = pkg;

    this.hash = hash({
      key: this.key,
      ty: this.ty,
      package: this.package.path,
    });

    // registry.exportFlag(this);
  }

  in(ctx: BuildContext): flag.FlagVar<T> {
    if (ctx.ownFlags.has(this)) {
      return ctx.ownFlags.get(this);
    } else {
      // FIXME: undefined
      return ctx.parent ? this.in(ctx.parent) : (undefined as any);
    }
  }

  is(value: flag.FlagVar<T>): BuildContextModifier {
    return {
      modify: (ctx) => ctx.ownFlags.set(this, value),
    };
  }

  [TO_JSON]() {
    const name = (this.key as symbol).description || this.key;
    return {
      key: name as string,
      ty: this.ty,
      package: this.package.path,
    };
  }

  [TO_SCHEMA](schema: Schema): object {
    if (!schema.flags[this.hash]) {
      const obj = {} as any;
      schema.flags[this.hash] = obj;
      Object.assign(obj, this[TO_JSON]());
    }

    return { kind: "flag", $ref: this.hash };
  }
}

// deno-lint-ignore no-namespace
export namespace flag {
  export function option<const S extends string>(allowed: S[]): OptionFlag<S> {
    return { kind: "option", allowed };
  }
  export function string(): StringFlag {
    return { kind: "string" };
  }

  export type StringFlag = {
    kind: "string";
  };

  export type OptionFlag<V> = {
    kind: "option";
    allowed: V[];
  };

  export type FlagType<V> = StringFlag | OptionFlag<V>;
  export type FlagVar<T> = T extends flag.OptionFlag<infer S>
    ? S
    : T extends flag.StringFlag
    ? string
    : never;
}
