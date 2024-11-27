import { ResponseError } from "vscode-jsonrpc/node.js";

export class RpcError extends ResponseError<{ stack?: string }> {
}
