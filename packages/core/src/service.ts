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
  fileset(glob: string[]): Promise<string[]>;
  ready(): Promise<void>;
  process(process: ProcessSpec): Promise<void>;
  // $: ExecaScriptMethod;
}

export const $autorun = Symbol("Autorun");

export interface IService {
  cwd(path: string): void;
  select(name: string, options: { options: string[]; default: string }): void;
  action(
    name: string,
    options?: { label?: string; icon?: string; description?: string }
  ): void;
  autorun(): void;
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
  ) {
    this.options.set(name, {
      select: {
        name,
        options,
        default: defaultOption,
      },
    });
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
