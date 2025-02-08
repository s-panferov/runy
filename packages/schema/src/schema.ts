import { TO_SCHEMA } from "./symbols";

export enum SchemaMode {
  Input,
  Output,
  Unknown,
}

export class Schema {
  #mode: SchemaMode = SchemaMode.Unknown;

  contexts: Record<string, object> = {};
  targets: Record<string, object> = {};
  builds: Record<string, object> = {};
  flags: Record<string, object> = {};
  root!: object;

  static convert(a: ToSchema): Schema {
    const schema = new Schema();
    const root = a[TO_SCHEMA](schema);
    schema.root = root;
    return schema;
  }

  toJSON() {
    return {
      contexts: this.contexts,
      targets: this.targets,
      builds: this.builds,
      flags: this.flags,
      root: this.root,
    };
  }

  convert = <V>(obj: V): V extends ToSchema ? object : V => {
    return hasSchema(obj) ? (obj as ToSchema)[TO_SCHEMA](this) : obj;
  };

  get isOutputMode(): boolean {
    return this.#mode == SchemaMode.Output;
  }

  get isInputMode(): boolean {
    return this.#mode == SchemaMode.Input;
  }

  get mode() {
    return this.#mode;
  }

  withMode(mode: SchemaMode): this {
    // assert(mode == SchemaMode.Unknown);
    this.#mode = mode;
    return this;
  }
}

export interface ToSchema {
  [TO_SCHEMA](schema: Schema): any;
}

function hasSchema(v: unknown): v is ToSchema {
  return !!v && typeof v === "object" && (v as any)[TO_SCHEMA]!!;
}
