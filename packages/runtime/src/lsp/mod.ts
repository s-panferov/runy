import { Declaration } from "@runy-build/types";

import { buildfile, registry } from "@runy-build/schema";

import { DeepReadonly } from "../utils";
import { build } from "./build";
import { cancel } from "./cancel";

import log from "winston";
import process from "node:process";

import * as rpc from "vscode-jsonrpc/node.js";
import { evaluate } from "./evaluate";
import { terminate } from "./terminate";

export function prepareDeclarations() {
  const declarations: DeepReadonly<Declaration>[] = [];
  for (const buildfile of registry.buildfiles.values()) {
    for (const target of buildfile.targets.values()) {
      declarations.push({
        kind: "target",
        ...target.toJSON(),
      });
    }
    for (const flag of buildfile.flags.values()) {
      declarations.push({
        kind: "flag",
        ...flag.toJSON(),
      });
    }
  }

  return declarations;
}

export function dumpDeclarations(module: ImportMeta) {
  if (!(module as any).main) {
    return;
  }

  let decls = prepareDeclarations();
  console.log(JSON.stringify(decls));
}

export const lsp = rpc.createMessageConnection(
  new rpc.StreamMessageReader(process.stdin),
  new rpc.StreamMessageWriter(process.stdout)
);

export async function startLsp() {
  log.info("Starting LSP server");

  lsp.onUnhandledNotification(() => {
    console.error("Unhandled notification");
  });

  lsp.onRequest("runy/declarations", () => {
    const declarations: DeepReadonly<Declaration>[] = prepareDeclarations();
    return declarations;
  });

  lsp.onRequest(evaluate.ty, evaluate);
  lsp.onRequest(cancel.ty, cancel);
  lsp.onRequest(build.ty, build);
  lsp.onRequest(terminate.ty, terminate);

  lsp.onError((err) => {
    console.error(err);
  });

  lsp.onClose(() => {
    terminate();
  });

  await lsp.sendNotification("initialized", {});

  lsp.listen();
}
