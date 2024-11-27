import { missing } from "./missing";

import { Schema } from "./schema";

import { Compute, Provide } from "./index";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";

export type QueryV<E> = {
  [K in keyof E]: Query<Provide<E[K]>>;
};

export type Query<E> =
  & QueryV<E>
  & Compute
  & {
    [PROVIDE_SYM]: E;
  };

export class Output<T extends Compute> implements Compute {
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: T[typeof RESULT_SYM];
  [PROVIDE_SYM]!: T[typeof PROVIDE_SYM];

  constructor(
    private parent: Compute | undefined,
    private name: string | symbol | undefined,
  ) {
  }

  chain<E extends object>(): this & E {
    return missing<this, E>(this, (prop) => {
      return new Output(this, prop as any).chain();
    });
  }

  toSchema(schema: Schema) {
    const parent = typeof this.parent != "undefined"
      ? this.parent.toSchema(schema)
      : undefined;

    return [
      parent,
      {
        kind: "output",
        name: this.name,
      },
    ].flat().filter(Boolean);
  }
}
