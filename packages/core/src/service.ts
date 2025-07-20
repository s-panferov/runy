import "./lsp.ts";

import { ExecaScriptMethod } from "execa";

import { Workspace } from "./module.ts";
import type { JsonRpcProcess } from "./rpc.ts";
import { RunningService } from "./lsp.ts";

export interface ServiceRunFunc<A, R> {
  (ctx: ServiceContext, args: A): Promise<R>;
}

export interface ServiceSpecFunc {
  (ctx: Service): void;
}

export interface ServiceContext {
  cwd: string;
  fileset(glob: string[]): Promise<string[]>;
  ready(): Promise<void>;
  process(process: JsonRpcProcess): Promise<void>;
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

  static isAutorun(service: Service): boolean {
    return service[$autorun];
  }

  static getRunFunc<A, R>(service: Service): ServiceRunFunc<A, R> | undefined {
    return service.#run;
  }

  static getCwd(service: Service): string | undefined {
    return service.#cwd;
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
