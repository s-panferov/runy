import { Compute } from "./index";
import { Schema } from "./schema";
import { FileSetInfo } from "@runy-build/types";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM } from "./symbols";

export class Folder implements Compute {
  __TYPE!: "FOLDER";

  [COMPUTE_SYM]!: true;
  [PROVIDE_SYM]!: FileSetInfo;
  [RESULT_SYM]!: string;

  parent?: Compute;
  path?: string;

  origin?: Compute;

  constructor(path?: string, parent?: Compute) {
    this.path = path;
    this.parent = parent;
  }

  toSchema(schema: Schema) {
    if (schema.isInputMode && this.origin) {
      return this.origin.toSchema(schema);
    }
    return [
      typeof this.parent != "undefined"
        ? this.parent.toSchema(schema)
        : undefined,
      {
        kind: "folder",
        path: this.path,
      },
    ]
      .flat()
      .filter(Boolean);
  }
}
