import { cmd, Command } from "./cmd";
import { BuildContext, Output, Query } from "./index";
import { Schema, SchemaMode } from "./schema";
import { SpecT } from "./target";

export interface BuildSpecArgs<T extends SpecT> {
  key?: string[];
  inp: T["In"];
  out: T["Out"];
  inout?: T["InOut"];
  ready?: T["Ready"];
}

export class BuildSpec<T extends SpecT> {
  key: string[];
  inp: T["In"];
  out: T["Out"];
  inout: T["InOut"];
  ready?: T["Ready"];

  #command?: Command;
  #runtime?: string;

  constructor(args: BuildSpecArgs<T>) {
    this.inp = args.inp;
    this.out = args.out;
    this.inout = args.inout || {};
    this.ready = args.ready;
    this.key = args.key || [];
  }

  runtime<T extends { default: { SPEC: T } }>(path: string): this {
    this.#runtime = path;
    return this;
  }

  command(
    func: (
      ctx: typeof cmd & {
        $: typeof cmd;
        inp: Query<T["In"]>;
        out: Query<T["Out"]>;
      },
      inp: Query<T["In"]>,
      out: Query<T["Out"]>
    ) => Command
  ): this {
    function $(...args: any[]) {
      return cmd.apply(null, args as any);
    }

    $.$ = cmd;
    $.inp = new Output<Query<T["In"]>>(undefined, "inp").chain() as any;
    $.out = new Output<Query<T["Out"]>>(undefined, "out").chain() as any;
    $.sh = cmd.sh;

    this.#command = func($, $.inp, $.out);
    return this;
  }

  toSchema(schema: Schema) {
    const object = {
      key: this.key,
      inp: {} as Record<string, any>,
      out: {} as Record<string, any>,
      inout: {} as Record<string, any>,
      ready: {} as Record<string, any>,
      command: undefined as object | undefined,
      runtime: this.#runtime,
    };

    if (!this.#runtime) {
      delete object.runtime;
    }

    const before = schema.mode;

    schema.withMode(SchemaMode.Input);
    for (const [k, v] of Object.entries(this.inp)) {
      if (!v) continue;
      object.inp[k] = schema.convert(v);
    }

    schema.withMode(SchemaMode.Output);

    for (const [k, v] of Object.entries(this.out)) {
      if (!v) continue;
      object.out[k] = schema.convert(v);
    }

    for (const [k, v] of Object.entries(this.inout)) {
      if (!v) continue;
      object.inout[k] = schema.convert(v);
    }

    if (this.ready) {
      for (const [k, v] of Object.entries(this.ready)) {
        if (!v) continue;
        object.ready[k] = schema.convert(v);
      }
    }

    if (this.#command) {
      object.command = schema.convert(this.#command);
    } else {
      delete object.command;
    }

    schema.withMode(before);

    return object;
  }
}

export type BuildSpecFactory<T extends SpecT> = (
  ctx: BuildContext
) => BuildSpec<T>;
