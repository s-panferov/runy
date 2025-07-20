import "./lsp.ts";
import { Service, ServiceSpecFunc } from "./service.ts";
import { Protocol } from "./proto.ts";
import { logger } from "./logger.ts";

import { RpcRequest, RpcResponse, ServiceMetadata } from "@runy-dev/proto/rpc";
import { LspServiceContext, RunningService } from "./lsp.ts";

let globalModule: Workspace;
export function mainWorkspace() {
  return globalModule;
}

export function getService(name: string): Service {
  let service = globalModule?.services.get(name);
  if (!service) {
    throw new Error(`Service not found: ${name}`);
  }
  return service;
}

export class Workspace {
  meta: ImportMeta;
  services: Map<string, Service> = new Map();
  proto = new Protocol("127.0.0.1:4122");
  workspace: string;

  constructor(meta: ImportMeta) {
    this.meta = meta;
    this.workspace = process.env.RUNY_WORKSPACE || meta.filename || meta.url;

    setTimeout(async () => {
      logger.error("Initializing LSP...");

      this.proto.onRequest(async (req) => {
        if (req.render) {
          logger.error("Received render request:", req.render);
          const service = this.services.get(req.render.service)!;

          if (!service.running) {
            const context = new LspServiceContext(service, req.render);
            const running = new RunningService(context, service);
            service.running = running;
          }

          await service.running.cycle();

          logger.error(
            "Render request processed for service:",
            req.render.service
          );

          return RpcResponse.create({
            render: {},
          });
        } else {
          return RpcResponse.create({
            error: {
              code: 400,
              message: `Unknown request`,
            },
          });
        }
      });

      await this.proto.connect();
      await this.proto.notify(
        RpcRequest.create({
          initialize: {
            workspace: this.workspace,
          },
        })
      );

      await this.proto.notify(
        RpcRequest.create({
          metadata: {
            workspace: this.workspace,
            services: Array.from(this.services.values()).map((service) =>
              ServiceMetadata.create({
                name: service.name,
                cwd: Service.getCwd(service),
                autorun: Service.isAutorun(service),
              })
            ),
            alive: Array.from(this.services.keys()),
          },
        })
      );

      logger.error("LSP initialized");
    }, 0);
  }

  service = <A, R>(name: string, func: ServiceSpecFunc) => {
    const spec = new Service(this, name);
    func(spec);

    this.services.set(name, spec);
    return spec;
  };

  fileset = (glob: string[]) => {};
}

export function workspace(meta: ImportMeta): Workspace {
  if (globalModule) {
    throw new Error("Module already initialized");
  }
  globalModule = new Workspace(meta);
  return globalModule;
}
