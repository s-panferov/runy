import { Compute } from "./index";
import { Schema, TO_SCHEMA } from "./schema";
import { COMPUTE_SYM, PROVIDE_SYM, REQUIRED_SYM, RESULT_SYM } from "./symbols";

import { zodToJsonSchema } from "zod-to-json-schema";
import { z, ZodTypeAny } from "zod";

export class Data<T extends ZodTypeAny> implements Compute {
  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: z.input<T>;
  [PROVIDE_SYM]!: z.output<T>;
  [REQUIRED_SYM]!: true;

  shape: T;

  constructor(shape: T) {
    this.shape = shape;
  }

  [TO_SCHEMA](_schema: Schema) {
    return [
      {
        kind: "data",
        schema: (zodToJsonSchema as any)(this.shape),
      },
    ]
      .flat()
      .filter(Boolean);
  }
}
