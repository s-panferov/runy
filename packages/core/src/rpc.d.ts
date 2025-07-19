export type Label = { workspace: string | null; package: string | null; name: string }
export type JsonRpcServiceStartRequest = { service: string; cwd: string }
export type JsonRpcBuildResult = { service: string; result: JsonValue | null; error: JsonValue | null }
export type JsonRpcFilesetRequest = { service: string; glob: string[] }
export type JsonRpcBuildDependency = { service: string; package: string }
export type JsonRpcUpdateRequest = { service: string }
export type JsonRpcCancelRequest = { service: string }
export type JsonRpcMetadata = Record<string, never>
export type JsonRpcMetadataResponse = { services: JsonRpcService[] }
export type JsonRpcService = { name: string; cwd: string | null; autorun: boolean }
export type JsonRpcProcess = { alias: string; cmd: string; args?: string[]; env?: Partial<{ [key in string]: string }> | null; cwd?: string | null; restart?: RestartStrategy }
export type JsonRpcDeclareProcess = { service: string; process: JsonRpcProcess }
export type RestartStrategy = 
/**
 * Never restart the process
 */
{ kind: "never" } | 
/**
 * Always restart the process immediately
 */
{ kind: "always" } | 
/**
 * Restart with exponential backoff
 */
{ kind: "exponential"; initial_delay: number; max_delay: number; multiplier: number; max_restarts: number | null } | 
/**
 * Restart with fixed delay
 */
{ kind: "fixed"; delay: number; max_restarts: number | null }
