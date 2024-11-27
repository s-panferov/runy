import { Compute, globalId } from "./index";

import { BuildContext, BuildContextModifier } from "./context";
import { Schema } from "./schema";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";
import { hash } from "./hash";

export class Flag<
  const K,
  const T extends flag.FlagType<unknown>,
> implements Compute {
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: flag.FlagVar<T>;
  [PROVIDE_SYM]!: flag.FlagVar<T>;

  chain: Compute[] = [];
  key!: K;
  ty!: T;
  buildfile!: string;

  hash: string;

  constructor(meta: ImportMeta, key: K, ty: T) {
    this.key = key;
    this.ty = ty;
    this.buildfile = meta.url;

    this.hash = hash({
      key: this.key,
      ty: this.ty,
      buildfile: this.buildfile,
    });

    // registry.exportFlag(this);
  }

  in(ctx: BuildContext): flag.FlagVar<T> {
    if (ctx.ownFlags.has(this)) {
      return ctx.ownFlags.get(this);
    } else {
      // FIXME: undefined
      return ctx.parent ? this.in(ctx.parent) : undefined as any;
    }
  }

  is(value: flag.FlagVar<T>): BuildContextModifier {
    return {
      modify: (ctx) => ctx.ownFlags.set(this, value),
    };
  }

  toJSON() {
    const name = (this.key as symbol).description || this.key;
    return {
      key: name as string,
      ty: this.ty,
      buildfile: this.buildfile,
    };
  }

  toSchema(schema: Schema): object {
    if (!schema.flags[this.hash]) {
      const obj = {} as any;
      schema.flags[this.hash] = obj;
      Object.assign(obj, this.toJSON());
    }

    return { kind: "flag", "$ref": this.hash };
  }
}

export function flag<
  const K extends symbol,
  const T extends flag.FlagType<any>,
>(
  meta: ImportMeta,
  symbol: K,
  ty: T,
): Flag<K, T> {
  const flag = new Flag<K, T>(meta, symbol, ty);
  return flag;
}

// deno-lint-ignore no-namespace
export namespace flag {
  export function string<const S extends string>(allowed: S[]): StringFlag<S> {
    return { kind: "string", allowed };
  }

  export type StringFlag<V> = {
    kind: "string";
    allowed: V[];
  };

  export type FlagType<V> = StringFlag<V>;
  export type FlagVar<T> = T extends flag.StringFlag<infer S> ? S : never;
}
