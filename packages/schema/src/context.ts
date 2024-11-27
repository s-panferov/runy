import { Compute, Target } from "./index";
import { Flag } from "./flag";
import { File } from "./file";
import { Folder } from "./folder";
import { Data } from "./data";
import { Schema } from "./schema";
import { AnyTargetT, SpecT } from "./target";
import { BuildSpec, BuildSpecArgs } from "./spec";
import { hash } from "./hash";

import { z, ZodTypeAny } from "zod";

export interface BuildContextModifier {
  modify(context: BuildContext): void;
}

export class ObjectCache {
  contexts: Map<string, BuildContext> = new Map();
}

const CONTEXTS: Map<string, BuildContext> = new Map();

export class BuildContext {
  // we put it here for simplicity
  chain?: Compute;

  parent?: BuildContext;

  ownFlags: Map<Flag<any, any>, any> = new Map();
  parentFlags: Map<Flag<any, any>, any> = new Map();

  hash: string = "";

  /**
   * Targets opened in this context
   */
  specs: Map<Target.Any, BuildSpec<AnyTargetT>> = new Map();

  constructor(...mods: BuildContextModifier[]) {
    for (const mod of mods) {
      mod.modify(this);
    }

    this.#updateHash();
  }

  z = z;

  #updateHash() {
    const obj = {} as Record<string, any>;

    for (const [flag, value] of this.parentFlags) {
      obj[flag.hash] = value;
    }

    for (const [flag, value] of this.ownFlags) {
      obj[flag.hash] = value;
    }

    this.hash = hash(obj);
    return this.hash;
  }

  outFile(path: string): File {
    return new File(path, this.chain);
  }

  outFolder(path?: string): Folder {
    return new Folder(path, this.chain);
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

  inout<
    const IO extends SpecT["InOut"],
    const R extends SpecT["Ready"] = Record<never, never>
  >(args: IO): BuildSpec<{ In: {}; Out: {}; InOut: IO; Ready: R }> {
    return new BuildSpec({
      inp: {},
      out: {},
      inout: args,
    });
  }

  define<
    const I extends SpecT["In"],
    const O extends SpecT["Out"],
    const IO extends SpecT["InOut"] = {},
    const R extends SpecT["Ready"] = Record<never, never>
  >(
    args: BuildSpecArgs<{ In: I; Out: O; InOut: IO; Ready: R }>
  ): BuildSpec<{ In: I; Out: O; InOut: IO; Ready: R }> {
    return new BuildSpec(args);
  }

  with(...mods: BuildContextModifier[]): BuildContext {
    const context = new BuildContext();

    // clone parent flags
    context.parentFlags = new Map(this.parentFlags);
    for (const [flag, value] of this.ownFlags) {
      context.parentFlags.set(flag, value);
    }

    for (const mod of mods) {
      mod.modify(context);
    }

    this.#updateHash();

    const exsiting = CONTEXTS.get(this.hash);
    if (exsiting) {
      return exsiting;
    } else {
      CONTEXTS.set(this.hash, context);
    }

    return context;
  }

  toSchema(schema: Schema): object {
    if (!schema.contexts[this.hash]) {
      const obj = {} as any;
      schema.contexts[this.hash] = obj;
      obj.parent = this.parent ? this.parent.toSchema(schema) : undefined;

      obj.flags = {} as any;
      for (const [flag, value] of this.ownFlags.entries()) {
        flag.toSchema(schema);
        obj.flags[flag.hash] = value;
      }
    }

    return { kind: "context", $ref: this.hash };
  }
}
