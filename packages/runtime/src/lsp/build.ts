import log from "winston";

import { BuildAPI, RUNTIME } from "../api";

import { Result, AnyTargetT } from "@runy-build/schema";
import { TargetBuildParams } from "@runy-build/types";

import { RpcError } from "./error";
import { delay } from "../util/delay";

import * as rpc from "vscode-jsonrpc/node.js";
import { BUILDER } from "../exec";

export const BUILD_MAP: Map<number, BuildAPI<AnyTargetT>> = new Map();

export async function build(params: TargetBuildParams) {
  log.info("Received build request", params);

  if (!BUILDER) {
    throw new RpcError(
      0,
      "No builder is defined for target " + params.target.name
    );
  }

  let ctx = BUILD_MAP.get(params.build_id);

  if (!ctx) {
    log.info("[deno] Setting up new build API", params.build_id);
    ctx = new BuildAPI(params.build_id, params.cwd);
    BUILD_MAP.set(params.build_id, ctx);
  }

  const runtime = ctx[RUNTIME];

  let shouldRestart = true;

  if (runtime.next) {
    shouldRestart = runtime.next(params.inputs, params.outputs, params.ready);
  }

  if (!shouldRestart) {
    log.info("[deno] Job should not restart", params.build_id);
    return runtime.promise;
  } else {
    log.info("[deno] Job should restart", params.build_id);
    await runtime.dispose();
    // Make sure everything is aborted
    await delay(100);
  }

  let result: Promise<Result<{}>>;
  try {
    log.info("[deno] Building job", params.build_id);
    result = BUILDER(ctx, params.inputs, params.outputs, params.ready);
  } catch (e) {
    result = Promise.reject(e);
  }

  // FIXME: do not accumulate waiting LSP methods

  runtime.promise = Promise.race([result, runtime.aborted] as Promise<
    Result<{}>
  >[])
    .then(async (result) => {
      await runtime.dispose();
      return result;
    })
    .catch(async (e) => {
      await runtime.dispose();
      throw new RpcError(0, "Error during build: " + e.toString(), {
        stack: e instanceof Error ? e.stack : undefined,
      });
    });

  return runtime.promise;
}

build.ty = new rpc.RequestType<TargetBuildParams, Result<any>, void>(
  "runy/target/build"
);
