import { Query } from "./output";
import { Schema, TO_SCHEMA, ToSchema } from "./schema";

type Var = Query<string | number | object>;

export interface CommandOptions {
  args: (string | Var)[];
}

export class Command implements ToSchema {
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
