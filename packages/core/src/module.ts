import "./lsp.ts";
import { Service, ServiceSpecFunc } from "./service.ts";
import { Protocol } from "./proto.ts";
import { logger } from "./logger.ts";

import { RpcRequest, RpcResponse } from "@runy-dev/proto/native/rpc.ts";
import { LspServiceContext, RunningService } from "./lsp.ts";

import { basename, dirname } from "node:path";
import { base36MD5 } from "./hash.ts";

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

export function getPathFromURL(urlOrPath: string): string {
  // Handle URLs
  if (urlOrPath.startsWith("file://")) {
    urlOrPath = urlOrPath.slice(7); // Remove 'file://' prefix
  } else if (urlOrPath.includes("://")) {
    // For other protocols, extract the pathname
    try {
      const url = new URL(urlOrPath);
      urlOrPath = url.pathname;
    } catch {
      // If URL parsing fails, treat as regular path
    }
  }

  return urlOrPath;
}

export class Workspace {
  meta: ImportMeta;
  services: Map<string, Service> = new Map();
  proto = new Protocol("127.0.0.1:4122");
  workspace: string;

  constructor(meta: ImportMeta) {
    this.meta = meta;

    const fullLabel = meta.filename || meta.url;
    const path = getPathFromURL(fullLabel);

    this.workspace =
      process.env.RUNY_WORKSPACE ||
      `${basename(path)}-${base36MD5(dirname(path))}`;

    this.proto.onRequest(this.onRequest.bind(this));

    setTimeout(async () => {
      logger.error("Initializing LSP...");

      await this.proto.connect();
      await this.proto.notify(
        RpcRequest.create({
          initialize: {
            workspace: {
              name: this.workspace,
              cwd: dirname(path),
            },
          },
        })
      );

      await this.proto.notify(
        RpcRequest.create({
          metadata: {
            workspace: this.workspace,
            services: Array.from(this.services.values()).map(
              Service.toMetadata
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

  private async onRequest(req: RpcRequest) {
    if (req.render) {
      logger.error("Received render request:", req.render);
      const service = this.services.get(req.render.service)!;

      if (!service.running) {
        const context = new LspServiceContext(service, req.render);
        const running = new RunningService(context, service);
        service.running = running;
      }

      await service.running.cycle();

      logger.error("Render request processed for service:", req.render.service);

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
  }
}

export function workspace(meta: ImportMeta): Workspace {
  if (globalModule) {
    throw new Error("Module already initialized");
  }
  globalModule = new Workspace(meta);
  return globalModule;
}
