import { Compute } from "./index";

import { Schema, TO_SCHEMA } from "./schema";
import { FileInfo } from "@runy-build/types";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";

export class File implements Compute {
  __TYPE!: "FILE";

  [COMPUTE_SYM]!: true;
  [PROVIDE_SYM]!: FileInfo;
  [RESULT_SYM]!: string;

  parent?: Compute;
  path?: string;
  origin?: Compute;

  constructor(path?: string, parent?: Compute) {
    this.path = path;
    this.parent = parent;
  }

  [TO_SCHEMA](schema: Schema) {
    if (schema.isInputMode && this.origin) {
      return schema.convert(this.origin);
    }

    return [
      typeof this.parent != "undefined"
        ? schema.convert(this.parent)
        : undefined,
      {
        kind: "file",
        path: this.path,
      },
    ]
      .flat()
      .filter(Boolean);
  }

  hashed() {
    return this;
  }
}

export function file(path: string): File {
  return new File(path);
}
