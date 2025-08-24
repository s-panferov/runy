import winston from "winston";

import {
  ConfigValue,
  ProcessSpec,
  Service,
  ServiceContext,
} from "./service.ts";
import * as ex from "execa";

import type { JsonRpcFilesetRequest } from "./rpc.ts";

import { RpcRequest } from "./proto.ts";
import { logger } from "./logger.ts";
import {
  ProcessMetadata,
  RestartStrategy,
} from "@runy-dev/proto/native/process.ts";
import { RenderService } from "@runy-dev/proto/native/rpc.ts";
import path from "node:path";

let __init = false;
export async function init() {
  if (__init) {
    return;
  }

  __init = true;
  winston.configure({
    levels: winston.config.syslog.levels,
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        stderrLevels: Object.keys(winston.config.syslog.levels),
      }),
    ],
  });

  process.stdin.on("end", function () {
    process.exit();
  });

  process.stdin.on("error", function () {
    process.exit();
  });

  process.stdout.on("end", function () {
    process.exit();
  });

  process.stdout.on("error", function () {
    process.exit();
  });

  // setTimeout(async () => {
  //   await proto.notify("runy/metadata", collectServices());
  // }, 10);

  // lsp.onError((err) => {
  //   terminate();
  // });

  // lsp.onRequest("runy/cancel", async (params: JsonRpcCancelRequest) => {
  //   let service = SERVICES.get(params.service);
  //   if (!service) {
  //     return;
  //   }

  //   logger.error("Cancel request received:", params);

  //   SERVICES.delete(params.service);
  //   await service.cancel();

  //   return;
  // });

  // // lsp.onRequest(updateReq, async (params: JsonRpcUpdateRequest, token) => {
  // //   logger.error("Update request received:", params);

  // //   let service = SERVICES.get(params.service);
  // //   if (!service) {
  // //     throw new Error(`Service not found: ${params.service}`);
  // //   }

  // //   return;
  // // });

  // lsp.onRequest("runy/start", async (params: JsonRpcServiceStartRequest) => {
  //   logger.error("Start request received:", params);

  //   let service = getService(params.service);

  //   const context = new LspServiceContext(params);
  //   const running = new RunningService(context, service);

  //   SERVICES.set(params.service, running);
  //   running.cycle();

  //   logger.error("Service started:", params.service);

  //   return;
  // });

  async function terminate() {
    logger.error("Terminating all services...");
    await Promise.allSettled(
      Array.from(SERVICES.values()).map((service) => service.cancel())
    );

    logger.error("All services terminated.");
    process.exit(0);
  }
}

init();

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface Disposable {
  dispose(): Promise<void>;
}

export function disposable(func: () => Promise<void>): Disposable {
  return {
    dispose: func,
  };
}

export class RunningService {
  context: LspServiceContext;
  service: Service;

  constructor(context: LspServiceContext, service: Service) {
    this.context = context;
    this.service = service;
  }

  async cancel() {
    await this.context.dispose();
  }

  async cycle(req: RenderService) {
    this.context.req = req;
    this.context.controller.abort();
    this.context.controller = new AbortController();

    let value: any | undefined;
    let error: Error | undefined;
    try {
      value = await Service.getRunFunc(this.service)?.(this.context, {});
    } catch (err) {
      error = err as Error;
    }

    // await lsp.sendNotification("runy/service/result", {
    //   service: this.context.req.service,
    //   result: value as any,
    //   error: error ? JSON.parse(JSON.stringify(error)) : undefined,
    // } satisfies JsonRpcBuildResult);
  }
}

export const SERVICES = new Map<string, RunningService>();

export class LspServiceContext implements ServiceContext {
  $: ex.ExecaScriptMethod<{}> & {
    sh: ex.ExecaScriptMethod<{}>;
  };

  req: RenderService;
  controller: AbortController;
  disposables: Disposable[] = [];
  cwd: string;
  service: Service;

  constructor(service: Service, req: RenderService) {
    this.req = req;
    this.controller = new AbortController();
    this.cwd = this.req.cwd;
    this.service = service;
    const run = ex.execa({});

    this.$ = ((...args: any[]) => {
      let run_ = run({
        cancelSignal: this.controller.signal,
        cwd: this.cwd,
        stderr: "pipe",
        stdout: "pipe",
        nodePath: "",
      } as any);

      let proc = run_.apply(null, args as any);
      const kill = async () => {
        try {
          logger.error("Running a disposable method for:", proc.pid);
          proc.kill("SIGTERM");
          await Promise.race([proc, delay(1000)]);
          proc.kill("SIGKILL");
        } catch (_: unknown) {}
      };
      process.on("beforeExit", kill);

      if ("pid" in proc) {
        this.disposables.push(
          disposable(async () => {
            logger.error("Disposing process:", proc.pid);

            process.off("beforeExit", kill);
            try {
              kill();
            } catch {
              /* ignore */
            }

            logger.error("Waiting for the process to exit:", proc.pid);
            try {
              await proc;
            } catch {
              /* ignore */
            }
            logger.error("Process terminated:", proc.pid);
          })
        );
      }

      return proc;
    }) as any;

    this.$.sh = ((_strings: TemplateStringsArray, ...values: any[]) => {
      let strings = Array.from(_strings);
      strings[0] += `bash -c "`;
      strings[strings.length - 1] += `"`;
      const array = strings as any as TemplateStringsArray;
      return this.$(array, ...values);
    }) as any;
  }

  get<T>(key: ConfigValue<T>): T {
    return this.req.config?.[key.name] ?? key.defaultValue;
  }

  async process(process: ProcessSpec): Promise<void> {
    if (!process.cwd) {
      process.cwd = this.cwd;
    }

    let restart: RestartStrategy | undefined;
    switch (process.restart?.kind) {
      case "always": {
        const { kind, ...rest } = process.restart;
        restart = RestartStrategy.fromPartial({
          always: rest,
        });
        break;
      }
      case "fixed": {
        const { kind, ...rest } = process.restart;
        restart = RestartStrategy.fromPartial({
          fixed: rest,
        });
        break;
      }
      case "exponential": {
        const { kind, ...rest } = process.restart;
        restart = RestartStrategy.fromPartial({
          exponential: rest,
        });
        break;
      }
      case "never": {
        const { kind, ...rest } = process.restart;
        restart = RestartStrategy.fromPartial({
          never: rest,
        });
        break;
      }
    }

    let watch = Array.isArray(process.watch)
      ? { include: process.watch }
      : process.watch;

    if (watch) {
      watch.prefix = watch.prefix
        ? path.join(this.cwd, watch.prefix)
        : this.cwd;
    }

    await this.service.module.proto.notify(
      RpcRequest.create({
        process: ProcessMetadata.create({
          service: this.req.service,
          cmd: process.cmd,
          args: process.args,
          cwd: process.cwd,
          alias: process.alias,
          restart: restart,
          env: process.env || {},
          watch: watch,
        }),
      })
    );
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
}
