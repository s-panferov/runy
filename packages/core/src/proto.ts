import {
  RpcServiceClient,
  RpcEnvelope,
  RpcRequest,
  RpcResponse,
  RpcError,
} from "@runy-dev/proto/native/rpc.ts";

import { ChannelCredentials } from "@runy-dev/proto/native";
import { logger } from "./logger.ts";

export { RpcRequest } from "@runy-dev/proto/native/rpc.ts";

type RequestHandler = (request: RpcRequest) => Promise<RpcResponse>;

interface PendingRequest {
  resolve: (value: RpcResponse) => void;
  reject: (error: Error) => void;
  timeoutId?: ReturnType<typeof setTimeout>;
}

export class Protocol {
  private client: RpcServiceClient;
  private stream: ReturnType<RpcServiceClient["streamRpc"]> | null = null;
  private handler!: RequestHandler;
  private pendingRequests = new Map<string, PendingRequest>();
  private requestId = 0;
  private connected = false;
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();

  constructor(address: string, credentials?: ChannelCredentials) {
    this.client = new RpcServiceClient(
      address,
      credentials || ChannelCredentials.createInsecure()
    );
  }

  async connect(): Promise<void> {
    if (this.connected) return;

    this.stream = this.client.streamRpc();

    // await new Promise<void>((resolve, reject) => {
    //   this.client.waitForReady(Date.now() + 5000, (error) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolve();
    //     }
    //   });
    // });

    this.connected = true;

    // Handle incoming messages
    this.stream.on("data", (envelope: RpcEnvelope) => {
      logger.info("RPC <- ", envelope);
      if (envelope.request) {
        this.handleIncomingRequest(envelope.request);
      } else if (envelope.response) {
        this.handleIncomingResponse(envelope.response);
      }
    });

    this.stream.on("error", (error: Error) => {
      this.connected = false;
      console.error("Stream error:", error);
      // Reject all pending requests
      for (const [id, pending] of this.pendingRequests) {
        pending.reject(new Error("Stream error"));
      }
      this.pendingRequests.clear();
    });

    this.stream.on("end", () => {
      this.connected = false;
      // Reject all pending requests
      for (const [id, pending] of this.pendingRequests) {
        pending.reject(new Error("Stream ended"));
      }
      this.pendingRequests.clear();
    });
  }

  async disconnect(): Promise<void> {
    if (this.stream) {
      this.stream.end();
      this.stream = null;
    }
    this.connected = false;
  }

  onRequest(handler: RequestHandler): void {
    this.handler = handler;
  }

  async notify(request: RpcRequest): Promise<void> {
    if (!this.connected || !this.stream) {
      throw new Error("Not connected");
    }

    const envelope = RpcEnvelope.create({
      request: request,
    });

    await this.write(envelope);
  }

  async request(ask: RpcRequest, timeout = 30000): Promise<any> {
    if (!this.connected || !this.stream) {
      throw new Error("Not connected");
    }

    const id = (++this.requestId).toString();
    ask.id = id;

    const envelope = RpcEnvelope.create({
      request: ask,
    });

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout`));
      }, timeout);

      this.pendingRequests.set(id, {
        resolve: (value) => {
          clearTimeout(timeoutId);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        timeoutId,
      });

      return this.write(envelope);
    });
  }

  private async handleIncomingRequest(request: RpcRequest): Promise<void> {
    let response: RpcResponse;

    if (!this.handler) {
      response = RpcResponse.create({
        id: request.id,
        error: RpcError.create({
          code: -32601,
          message: `Request handler not set`,
          data: new Uint8Array(0),
        }),
      });
    } else {
      try {
        response = await Promise.resolve(this.handler(request));
        response.id = request.id!;
      } catch (error) {
        response = RpcResponse.create({
          id: request.id,
          error: RpcError.create({
            code: -32603,
            message: error instanceof Error ? error.message : String(error),
            data: new Uint8Array(0),
          }),
        });
      }
    }

    const envelope = RpcEnvelope.create({
      response,
    });

    await this.write(envelope);
  }

  private write(envelope: RpcEnvelope): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.stream) {
        return reject(new Error("Stream is not connected"));
      }

      logger.info("RPC -> ", envelope);

      this.stream.write(envelope, (error: Error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
  }

  private handleIncomingResponse(response: RpcResponse): void {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) return;

    this.pendingRequests.delete(response.id);

    if (response.error) {
      const error = new Error(response.error.message);
      (error as any).code = response.error.code;
      (error as any).data = response.error.data;
      pending.reject(error);
    }

    pending.resolve(response);
  }
}
