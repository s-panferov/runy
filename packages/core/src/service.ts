import "./lsp.ts";

import { Workspace } from "./module.ts";
import { RunningService } from "./lsp.ts";
import { RestartStrategy as ProtoRestartStrategy } from "@runy-dev/proto/native/process.ts";
import {
  ServiceConfig,
  ServiceMetadata,
} from "@runy-dev/proto/native/service.ts";

export interface ServiceRunFunc<A, R> {
  (ctx: ServiceContext, args: A): Promise<R>;
}

export interface ServiceSpecFunc {
  (ctx: Service): void;
}

export type RestartAlways = {
  kind: "always";
} & ProtoRestartStrategy["always"];

export type RestartFixed = {
  kind: "fixed";
} & ProtoRestartStrategy["fixed"];

export type RestartExponential = {
  kind: "exponential";
} & ProtoRestartStrategy["exponential"];

export type RestartNever = {
  kind: "never";
} & ProtoRestartStrategy["never"];

export type RestartStrategy =
  | RestartAlways
  | RestartFixed
  | RestartExponential
  | RestartNever;

export interface ProcessSpec {
  alias: string;
  cmd: string;
  args?: string[];
  env?: Partial<{ [key in string]: string }> | null;
  cwd?: string | null;
  restart?: RestartStrategy;
  watch?:
    | string[]
    | {
        include: string[];
        exclude?: string[];
        prefix?: string;
      };
}

export interface ServiceContext {
  cwd: string;
  get<T>(key: ConfigValue<T>): T;
  process(process: ProcessSpec): Promise<void>;
  // $: ExecaScriptMethod;
}

export const $autorun = Symbol("Autorun");

export interface ConfigValue<T> {
  name: string;
  defaultValue: T;
}

export interface IService {
  /**
   * Set the working directory for the service.
   * @param path The path to the working directory, relative to the current file.
   */
  cwd(path: string): void;

  /**
   * Declare an option for the service.
   * @param name The name of the option.
   * @param options The options for the select input.
   */
  select(name: string, options: { options: string[]; default: string }): void;

  action(
    name: string,
    options?: { label?: string; icon?: string; description?: string }
  ): void;

  /**
   * Enable automatic running of the service.
   */
  autorun(): void;

  /**
   * Run the service with the given function.
   * @param func The function to run the service.
   */
  run<A, R>(func: ServiceRunFunc<A, R>): void;
}

export class Service implements IService {
  #run?: ServiceRunFunc<any, any>;
  [$autorun]: boolean = false;
  #cwd?: string;

  running?: RunningService;

  name: string;
  module: Workspace;

  options: Map<string, ServiceConfig> = new Map();

  static isAutorun(service: Service): boolean {
    return service[$autorun];
  }

  static getRunFunc<A, R>(service: Service): ServiceRunFunc<A, R> | undefined {
    return service.#run;
  }

  static getCwd(service: Service): string | undefined {
    return service.#cwd;
  }

  static toMetadata(service: Service): ServiceMetadata {
    return ServiceMetadata.create({
      name: service.name,
      cwd: Service.getCwd(service),
      autorun: Service.isAutorun(service),
      configs: Array.from(service.options.values()),
    });
  }

  constructor(module: Workspace, name: string) {
    this.name = name;
    this.module = module;
  }

  cwd(path: string) {
    this.#cwd = path;
  }

  select(
    name: string,
    {
      options,
      default: defaultOption,
    }: {
      options: string[];
      default: string;
    }
  ): ConfigValue<string> {
    this.options.set(name, {
      select: {
        name,
        options,
        default: defaultOption,
      },
    });

    return {
      name,
      defaultValue: defaultOption,
    } as ConfigValue<string>;
    // Implement the selection logic here
  }

  action(
    name: string,
    {
      label,
      icon,
      description,
    }: {
      label?: string;
      icon?: string;
      description?: string;
    } = {}
  ) {
    // Implement the button logic here
  }

  autorun() {
    this[$autorun] = true;
  }

  run<A, R>(func: ServiceRunFunc<A, R>) {
    this.#run = func;
  }
}
