import { Query } from "./output";
import { Schema, ToSchema } from "./schema";

type Var = Query<string | number | object>;

export interface CommandOptions {
  args: (string | Var)[];
}

export class Command implements ToSchema {
  options: CommandOptions;

  constructor(options: CommandOptions) {
    this.options = options;
  }

  toSchema(schema: Schema) {
    return {
      args: this.options.args.map(schema.convert),
    };
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

cmd.$ = cmd;
