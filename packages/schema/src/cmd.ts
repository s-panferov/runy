import { Compute } from ".";
import { Query } from "./output";
import { Schema, ToSchema } from "./schema";
import { COMPUTE_SYM, PROVIDE_SYM, RESULT_SYM, TO_SCHEMA } from "./symbols";

type Var = Query<string | number | object>;

export interface CommandOptions {
  args: (string | Var)[];
}

export class Command implements ToSchema, Compute {
  [COMPUTE_SYM]!: true;
  [PROVIDE_SYM]!: { stdout: string; stderr: string; code: number };
  [RESULT_SYM]!: string;

  private options: CommandOptions;
  private shell: boolean = false;

  constructor(options: CommandOptions) {
    this.options = options;
  }

  get sh(): this {
    this.shell = true;
    return this;
  }

  [TO_SCHEMA](schema: Schema) {
    let value: any = {
      kind: "command",
      args: this.options.args.map(schema.convert),
    };

    if (this.shell) {
      value.shell = this.shell;
    }

    return value;
  }
}

export function cmd(strings: TemplateStringsArray, ...values: Var[]): Command {
  // Combine the strings and values into an array
  const args: (string | Var)[] = [];
  for (let i = 0; i < strings.length; i++) {
    if (strings[i]) {
      args.push(strings[i]);
    }
    if (i < values.length) {
      args.push(values[i]);
    }
  }
  return new Command({
    args: args.filter((v) => !!v),
  });
}

cmd.sh = ((strings: TemplateStringsArray, ...values: any[]) => {
  return cmd(strings as any, ...values).sh;
}) as any as typeof cmd;

cmd.$ = cmd;
