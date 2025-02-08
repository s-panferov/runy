import { Compute } from ".";
import { Query } from "./output";
import { Schema, TO_SCHEMA, ToSchema } from "./schema";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";

type Var = Query<string | number | object>;

export interface RuntimeOptions {
  path: string;
}

export class Runtime implements ToSchema, Compute {
  [COMPUTE_SYM]!: true;
  [PROVIDE_SYM]!: string;
  [RESULT_SYM]!: string;

  private options: RuntimeOptions;

  constructor(options: RuntimeOptions) {
    this.options = options;
  }

  [TO_SCHEMA](_schema: Schema) {
    let value: any = {
      kind: "runtime",
      path: this.options.path,
    };

    return value;
  }
}
