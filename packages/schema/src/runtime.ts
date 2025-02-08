import { Compute } from ".";
import { Schema, ToSchema } from "./schema";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM, TO_SCHEMA } from "./symbols";

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
