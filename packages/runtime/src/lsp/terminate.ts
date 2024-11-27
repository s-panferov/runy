import { Result } from "@runy-build/schema";
import * as rpc from "vscode-jsonrpc/node.js";
import { BuildRef } from "../api";
import { lsp } from "./mod";

let __terminate = false;
export async function terminate() {
  if (__terminate) {
    return;
  }
  __terminate = true;
  console.error("Disposing all builds...");
  await BuildRef.disposeAll();

  console.error("Finished terminate...");

  setTimeout(() => {
    // allow to flush messages
    lsp.end();
    process.exit(0);
  }, 100);
}

terminate.ty = new rpc.RequestType<void, Result<any>, void>("runy/terminate");
