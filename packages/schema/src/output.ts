import { DYNAMIC, dynamic } from "./missing";

import { Schema, TO_SCHEMA } from "./schema";

import { Compute, Provide } from "./index";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";

export type QueryV<E> = {
  [K in keyof E]: Query<Provide<E[K]>>;
};

export type Query<E> = QueryV<E> &
  Compute & {
    [PROVIDE_SYM]: E;
  };

export class Output<T extends Compute> implements Compute {
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: T[typeof RESULT_SYM];
  [PROVIDE_SYM]!: T[typeof PROVIDE_SYM];

  private constructor(
    private parent: Compute | undefined,
    private name: string | symbol | undefined
  ) {
    this.parent = parent;
    this.name = name;
  }

  static dyn<T extends Compute>(
    parent: Compute | undefined,
    name: string | symbol | undefined
  ) {
    return dynamic(new Output<T>(parent, name)) as Query<T>;
  }

  [DYNAMIC] = (prop: string | symbol) => {
    if (prop === TO_SCHEMA) {
      return this[TO_SCHEMA];
    } else {
      return Output.dyn(this, prop);
    }
  };

  [TO_SCHEMA] = (schema: Schema) => {
    const parent =
      typeof this.parent != "undefined"
        ? schema.convert(this.parent)
        : undefined;

    return [
      parent,
      {
        kind: "output",
        name: this.name,
      },
    ]
      .flat()
      .filter(Boolean);
  };
}
