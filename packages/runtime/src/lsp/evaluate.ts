import { TargetEvaluateParams } from "@runy-build/types";
import { RpcError } from "./error";
import { BuildContext, registry, Schema } from "@runy-build/schema";

import * as rpc from "vscode-jsonrpc/node.js";
import log from "winston";

export function evaluate(params: TargetEvaluateParams) {
  const pkg = registry.resolvePackage(params.package);

  let target =
    params.target == "<<default>>"
      ? pkg?.defaultTarget
      : pkg?.targets.get(params.target);

  if (!target) {
    throw new RpcError(0, `Target ${params.target} not found`);
  }

  if (params.action != "build") {
    target = target.actions[params.action];
    if (!target) {
      throw new RpcError(
        0,
        "Target found, but has no action: " + params.action
      );
    }
  }

  log.info("packages " + JSON.stringify(Array.from(registry.packages.keys())));

  let ctx = new BuildContext();
  ctx = resolveFlags(params, ctx);

  try {
    const schema = Schema.convert(target.out(ctx) as any);
    return schema;
  } catch (e) {
    throw new RpcError(0, "Failed to build target: " + e, {
      stack: e instanceof Error ? e.stack : undefined,
    });
  }
}

evaluate.ty = new rpc.RequestType<TargetEvaluateParams, Schema, void>(
  "runy/target/evaluate"
);

function resolveFlags(params: TargetEvaluateParams, ctx: BuildContext) {
  let jsonFlags = params.flags as [[string, any]];
  jsonFlags.map(([flagRef, value]) => {
    let [pkg, name] = flagRef.split("#");
    let flagPkg = registry.resolvePackage(pkg);

    const flag = flagPkg.flags.get(name);

    if (!flag) {
      throw new RpcError(0, `flag not found: buildfile=${pkg} flag=${name}`);
    }

    ctx = ctx.with(flag.is(value));
  });
  return ctx;
}
