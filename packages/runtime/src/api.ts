import { ReadyNotif, TaskLog } from "@runy-build/types";
import { SpecT } from "@runy-build/schema";
import { Provide, Result } from "@runy-build/schema";
import { lsp } from "./lsp/mod";

import * as execa from "execa";

import { ProcessSpawnParams, ProcessSpawnResult } from "@runy-build/types";
import { delay } from "./util/delay";

export enum Level {
  Trace = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
}

export type NextHandler<T extends SpecT> = (
  inputs: Provide<T["In"]>,
  outputs: Provide<T["Out"]>,
  ready: Provide<T["Ready"]>
) => boolean;

export class BuildRuntime<T extends SpecT> {
  ctx: BuildAPI<T>;
  next?: NextHandler<T>;
  controller: AbortController;

  promise!: Promise<Result<{}>>;
  disposables: Disposable[] = [];

  constructor(ctx: BuildAPI<T>) {
    this.ctx = ctx;
    this.controller = new AbortController();
  }

  async dispose(): Promise<void> {
    try {
      this.controller.abort();
    } catch {
      /* ignore */
    }

    const disposables = this.disposables;
    this.disposables = [];
    await Promise.allSettled(disposables.map((d) => d.dispose()));

    this.controller = new AbortController();
  }

  get aborted(): Promise<unknown> {
    return new Promise<void>((_, reject) => {
      this.controller.signal.addEventListener("abort", (_) =>
        reject(new Error("aborted"))
      );
    });
  }
}

export const RUNTIME = Symbol();

export interface Disposable {
  dispose(): Promise<void>;
}

export function disposable(func: () => Promise<void>): Disposable {
  return {
    dispose: func,
  };
}

let isObject = function (a: any) {
  return !!a && a.constructor === Object;
};

export class BuildRef extends WeakRef<BuildAPI<any>> {
  static ALL = new Set<BuildRef>();
  constructor(build: BuildAPI<any>) {
    super(build);
    BuildRef.ALL.add(new WeakRef(build));
  }

  static disposeAll = () => {
    const all = BuildRef.ALL;
    BuildRef.ALL = new Set();
    return Promise.allSettled(
      Array.from(all)
        .map((v) => v.deref())
        .filter((v) => !!v)
        .map((v) => {
          return v[RUNTIME].dispose();
        })
    );
  };
}

// Clean up any dead references periodically
setInterval(() => {
  for (const ref of BuildRef.ALL) {
    if (!ref.deref()) {
      BuildRef.ALL.delete(ref);
    }
  }
}, 10 * 1000);

// Make sure to clear the interval when it's no longer needed
// For example, when your application is shutting down:
// clearInterval(cleanupInterval);

export class BuildAPI<T extends SpecT> {
  public readonly id: number;
  public readonly cwd: string;

  #runtime: BuildRuntime<T> = new BuildRuntime(this);
  $: execa.ExecaMethod<{}>;
  #ref: BuildRef;

  constructor(id: number, cwd: string) {
    this.id = id;
    this.cwd = cwd;
    this.#ref = new BuildRef(this);

    const run = execa.execa({});

    this.$ = ((...args: any[]) => {
      let run_ = run({
        cancelSignal: this.#runtime.controller.signal,
        cwd: this.cwd,
        stderr: this.stderr(),
        stdout: this.stdout(),
        nodePath: "",
      });

      let proc = run_.apply(null, args as any);
      const kill = async () => {
        try {
          console.error("Running a disposable method for:", proc.pid);
          proc.kill("SIGTERM");
          await Promise.race([proc, delay(1000)]);
          proc.kill("SIGKILL");
        } catch (_: unknown) {}
      };
      process.on("beforeExit", kill);

      if ("pid" in proc) {
        this[RUNTIME].disposables.push(
          disposable(async () => {
            process.off("beforeExit", kill);
            try {
              kill();
            } catch {
              /* ignore */
            }

            console.error("Waiting for the process to exit:", proc.pid);
            try {
              await proc;
            } catch {
              /* ignore */
            }
            console.error("Process terminated:", proc.pid);
          })
        );
      }

      return proc;
    }) as any;
  }

  get aborted(): Promise<unknown> {
    return this.#runtime.aborted;
  }

  /**
   * Create an `stdout` stream which will forward
   * everything to the logging system.
   */
  stdout(): WritableStream {
    const decoder = new TextDecoder();
    return new WritableStream({
      write: (data: Uint8Array): Promise<void> => {
        const value = decoder.decode(data);
        this.log(value, Level.Info);
        return Promise.resolve();
      },
    });
  }

  /**
   * Create an `stderr` stream which will forward
   * everything to the logging system.
   */
  stderr(): WritableStream {
    const decoder = new TextDecoder();
    return new WritableStream({
      write: (data: Uint8Array): Promise<void> => {
        const value = decoder.decode(data);
        this.log(value, Level.Error);
        return Promise.resolve();
      },
    });
  }

  get [RUNTIME]() {
    return this.#runtime;
  }

  next(func: NextHandler<T>) {
    this.#runtime.next = func;
  }

  async spawnRemote(spawn: ProcessSpawnParams): Promise<ProcessSpawnResult> {
    const res = await lsp.sendRequest<ProcessSpawnResult>(
      "runy/process/spawn",
      spawn
    );

    return res as ProcessSpawnResult;
  }

  // async run(
  //   [cmd, ...args]: string[],
  //   options: execa.Options = {},
  // ): Promise<execa.Result> {
  //   const signal = this.#runtime.controller.signal;
  //   const finalOpts = {
  //     cwd: this.cwd,
  //     stderr: this.stderr(),
  //     stdout: this.stdout(),
  //     cancelSignal: signal,
  //     ...options,
  //   } as execa.Options;

  //   const process = execa.execa(cmd, args, finalOpts);

  //   this.log("Executing + " + JSON.stringify({ cmd: cmd, ...finalOpts }));

  //   this[RUNTIME].disposables.push(disposable(async () => {
  //     try {
  //       process.kill();
  //     } catch {
  //       /* ignore */
  //     }

  //     console.error("Waiting for the process to exit:", cmd);
  //     try {
  //       await process
  //     } catch {
  //       /* ignore */
  //     }
  //     console.error("Process terminated:", cmd);
  //   }));

  //   const status = await process;

  //   if (status.exitCode != 0) {
  //     throw new Error("Failed to execute command: " + status.code);
  //   }

  //   return status;
  // }

  async ready(value: Provide<T["Ready"]>) {
    await lsp.sendNotification("runy/task/ready", {
      build_id: this.id,
      value: value,
    } as ReadyNotif);
  }

  async log(value: string, level?: Level) {
    await lsp.sendNotification("runy/task/log", {
      build_id: this.id,
      value: value,
      level: level ?? Level.Info,
    } as TaskLog);
  }
}
