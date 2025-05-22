import { Schema, ToSchema } from "./schema";
import { TO_SCHEMA } from "./symbols";

export interface RuntimeOptions {
  path: string;
}

export class Runtime implements ToSchema {
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
