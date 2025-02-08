import { Compute } from "./index";
import { Schema } from "./schema";
import { FileSetInfo } from "@runy-build/types";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM, TO_SCHEMA } from "./symbols";

export class FileSet implements Compute {
  __TYPE!: "FILESET";

  [COMPUTE_SYM]!: true;
  [RESULT_SYM]!: string[];
  [PROVIDE_SYM]!: FileSetInfo;

  parent?: Compute;
  patterns: string[];

  origin?: Compute;

  constructor(patterns: string[]) {
    this.patterns = patterns;
  }

  toJSON() {
    return {
      kind: "fileset",
      patterns: this.patterns,
    };
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
        kind: "fileset",
        path: this.patterns,
      },
    ]
      .flat()
      .filter(Boolean);
  }
}

export function fileset(globs: string[]): FileSet {
  return new FileSet(globs);
}
