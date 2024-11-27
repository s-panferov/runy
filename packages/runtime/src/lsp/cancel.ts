import { TargetBuildParams } from "@runy-build/types";
import { BUILD_MAP } from "./build";
import { RUNTIME } from "../api";

import * as rpc from "vscode-jsonrpc/node.js";

export async function cancel(params: TargetBuildParams) {
  const api = BUILD_MAP.get(params.build_id);
  if (api) {
    BUILD_MAP.delete(params.build_id);
    await api[RUNTIME].dispose();
  }
}

cancel.ty = new rpc.RequestType<TargetBuildParams, void, void>(
  "runy/build/cancel"
);
