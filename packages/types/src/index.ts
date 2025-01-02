// deno-lint-ignore-file no-explicit-any
export type Declaration =
  | ({ kind: "target" } & TargetSchema)
  | ({ kind: "flag" } & FlagSchema);
export type TargetDecl = {
  name: string;
  package?: string | null;
  sources?: any;
  deps?: any;
  flags?: any | null;
};
export type FlagDecl = (
  | { type: "boolean"; default?: boolean | null }
  | { type: "string"; default?: string | null; allowed?: string[] | null }
) & {
  name: string;
  package: string | null;
  required?: boolean;
};
export type TargetSchema = {
  package: string;
  name: string;
  runtime?: boolean;
};
export type FlagSchema = { key: string; package: string; ty: FlagType };
export type Ref = { package: string; name: string };
export type FileInfo = {
  path: string;
  modifiedAt: number | null;
  hash: string | null;
};
export type FileSetInfo = { root: string; files: FileInfo[] };
export type FlagType =
  | { type: "boolean"; default?: boolean | null }
  | { type: "string"; default?: string | null; allowed?: string[] | null };
export type TargetBuildParams = {
  build_id: number;
  target: Ref;
  pipe: string;
  cwd: string;
  inputs: any;
  outputs: any;
  ready: any;
};
export type BuildCancelParams = { build_id: number };
export type TargetEvaluateParams = {
  target: string;
  package: string;
  action: string;
  flags: any;
};
export type ProcessSpawnParams = {
  build_id: number;
  command: string;
  args: string[];
  env: [string, string][];
  cwd: string;
};
export type ProcessSpawnResult = { exit_code: number };
export type ProtocolMessage = { ExportTarget: TargetDecl };
export type TaskLog = { build_id: number; level: number; value: string };
export type ReadyNotif = { build_id: number; value: any };
