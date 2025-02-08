import { ZodTypeAny } from "zod";
import { cmd, Command } from "./cmd";
import { Data } from "./data";
import { Folder } from "./folder";
import { file, File } from "./file";
import { fileset } from "./fileset";

import { BuildContext, Output, Query, z } from "./index";
import { Schema, SchemaMode } from "./schema";
import { AnySpecT, SpecT } from "./target";
import { Runtime } from "./runtime";
import { TO_SCHEMA } from "./symbols";

export interface BuildSpecArgs<T extends SpecT> {
  key?: string[];
  inp: T["In"];
  out: T["Out"];
  inout?: T["InOut"];
  ready?: T["Ready"];
}

export class BuildSpec<T extends SpecT = AnySpecT> {
  #key: string[];
  #in: T["In"];
  #out: T["Out"];
  #inout: T["InOut"];
  #ready?: T["Ready"];

  constructor() {
    this.#in = {};
    this.#out = {};
    this.#inout = {};
    this.#ready = {};
    this.#key = [];
  }

  runtime<T extends { default: { SPEC: T } }>(path: string): Runtime {
    return new Runtime({ path });
  }

  in<const I extends SpecT["In"]>(
    this: BuildSpec<T>,
    inp: I
  ): asserts this is BuildSpec<{
    In: T["In"] & I;
    Out: T["Out"];
    InOut: T["InOut"];
    Ready: T["Ready"];
  }> {
    this.#in = { ...this.#in, ...inp };
    return this as any;
  }

  out<const O extends SpecT["Out"]>(
    out: O
  ): asserts this is BuildSpec<{
    In: T["In"];
    Out: T["Out"] & O;
    InOut: T["InOut"];
    Ready: T["Ready"];
  }> {
    this.#out = { ...this.#out, ...out };
    return this as any;
  }

  inout<const IO extends SpecT["InOut"]>(
    inout: IO
  ): BuildSpec<{
    In: T["In"];
    Out: T["Out"];
    InOut: T["InOut"] & IO;
    Ready: T["Ready"];
  }> {
    this.#inout = { ...this.#inout, ...inout };
    return this as any;
  }

  fileset = fileset;
  file = file;

  outFile(path: string): File {
    return new File(path, undefined);
  }

  outFolder(path?: string): Folder {
    return new Folder(path, undefined);
  }

  boolean() {
    return new Data(z.boolean());
  }

  number() {
    return new Data(z.number());
  }

  data<T extends ZodTypeAny>(schema: T) {
    return new Data(schema);
  }

  // define<
  //   const I extends SpecT["In"],
  //   const O extends SpecT["Out"],
  //   const IO extends SpecT["InOut"] = {},
  //   const R extends SpecT["Ready"] = Record<never, never>
  // >(
  //   args: BuildSpecArgs<{ In: I; Out: O; InOut: IO; Ready: R }>
  // ): BuildSpec<{ In: I; Out: O; InOut: IO; Ready: R }> {
  //   return new BuildSpec(args);
  // }

  cmd(
    func: (
      ctx: typeof cmd & {
        $: typeof cmd;
        inp: Query<T["In"]>;
        out: Query<T["Out"]>;
      },
      inp: Query<T["In"]>,
      out: Query<T["Out"]>
    ) => Command
  ): Command {
    function $(...args: any[]) {
      return cmd.apply(null, args as any);
    }

    $.$ = cmd;
    $.inp = Output.dyn<Query<T["In"]>>(undefined, "inp");
    $.out = Output.dyn<Query<T["Out"]>>(undefined, "out");
    $.sh = cmd.sh;

    return func($, $.inp, $.out);
  }

  [TO_SCHEMA](schema: Schema) {
    const object = {
      key: this.#key,
      inp: {} as Record<string, any>,
      out: {} as Record<string, any>,
      inout: {} as Record<string, any>,
      ready: {} as Record<string, any>,
    };

    const before = schema.mode;

    schema.withMode(SchemaMode.Input);
    for (const [k, v] of Object.entries(this.#in)) {
      if (!v) continue;
      object.inp[k] = schema.convert(v);
    }

    schema.withMode(SchemaMode.Output);

    for (const [k, v] of Object.entries(this.#out)) {
      if (!v) continue;
      object.out[k] = schema.convert(v);
    }

    for (const [k, v] of Object.entries(this.#inout)) {
      if (!v) continue;
      object.inout[k] = schema.convert(v);
    }

    if (this.#ready) {
      for (const [k, v] of Object.entries(this.#ready)) {
        if (!v) continue;
        object.ready[k] = schema.convert(v);
      }
    }

    schema.withMode(before);

    return object;
  }
}

export type BuildSpecFactory<T extends SpecT> = (
  spec: BuildSpec<SpecT>,
  context: BuildContext
) => BuildSpec<T>;
