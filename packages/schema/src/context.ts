import { Target } from "./index";
import { Flag } from "./flag";
import { Schema } from "./schema";
import { AnyTargetT } from "./target";
import { BuildSpec } from "./spec";
import { hash } from "./hash";

import { z } from "zod";
import { TO_SCHEMA } from "./symbols";

export interface BuildContextModifier {
  modify(context: BuildContext): void;
}

export class ObjectCache {
  contexts: Map<string, BuildContext> = new Map();
}

const CONTEXTS: Map<string, BuildContext> = new Map();

export class BuildContext {
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

  [TO_SCHEMA](schema: Schema): object {
    if (!schema.contexts[this.hash]) {
      const obj = {} as any;
      schema.contexts[this.hash] = obj;
      obj.parent = this.parent ? this.parent[TO_SCHEMA](schema) : undefined;

      obj.flags = {} as any;
      for (const [flag, value] of this.ownFlags.entries()) {
        schema.convert(flag);
        obj.flags[flag.hash] = value;
      }
    }

    return { kind: "context", $ref: this.hash };
  }
}
