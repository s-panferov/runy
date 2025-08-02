import * as jspb from 'google-protobuf'



export class Watch extends jspb.Message {
  getPrefix(): string;
  setPrefix(value: string): Watch;

  getIncludeList(): Array<string>;
  setIncludeList(value: Array<string>): Watch;
  clearIncludeList(): Watch;
  addInclude(value: string, index?: number): Watch;

  getExcludeList(): Array<string>;
  setExcludeList(value: Array<string>): Watch;
  clearExcludeList(): Watch;
  addExclude(value: string, index?: number): Watch;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Watch.AsObject;
  static toObject(includeInstance: boolean, msg: Watch): Watch.AsObject;
  static serializeBinaryToWriter(message: Watch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Watch;
  static deserializeBinaryFromReader(message: Watch, reader: jspb.BinaryReader): Watch;
}

export namespace Watch {
  export type AsObject = {
    prefix: string,
    includeList: Array<string>,
    excludeList: Array<string>,
  }
}

export class ProcessMetadata extends jspb.Message {
  getService(): string;
  setService(value: string): ProcessMetadata;

  getAlias(): string;
  setAlias(value: string): ProcessMetadata;

  getCmd(): string;
  setCmd(value: string): ProcessMetadata;

  getCwd(): string;
  setCwd(value: string): ProcessMetadata;
  hasCwd(): boolean;
  clearCwd(): ProcessMetadata;

  getRestart(): RestartStrategy | undefined;
  setRestart(value?: RestartStrategy): ProcessMetadata;
  hasRestart(): boolean;
  clearRestart(): ProcessMetadata;

  getArgsList(): Array<string>;
  setArgsList(value: Array<string>): ProcessMetadata;
  clearArgsList(): ProcessMetadata;
  addArgs(value: string, index?: number): ProcessMetadata;

  getEnvMap(): jspb.Map<string, string>;
  clearEnvMap(): ProcessMetadata;

  getWatch(): Watch | undefined;
  setWatch(value?: Watch): ProcessMetadata;
  hasWatch(): boolean;
  clearWatch(): ProcessMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ProcessMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ProcessMetadata): ProcessMetadata.AsObject;
  static serializeBinaryToWriter(message: ProcessMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ProcessMetadata;
  static deserializeBinaryFromReader(message: ProcessMetadata, reader: jspb.BinaryReader): ProcessMetadata;
}

export namespace ProcessMetadata {
  export type AsObject = {
    service: string,
    alias: string,
    cmd: string,
    cwd?: string,
    restart?: RestartStrategy.AsObject,
    argsList: Array<string>,
    envMap: Array<[string, string]>,
    watch?: Watch.AsObject,
  }

  export enum CwdCase { 
    _CWD_NOT_SET = 0,
    CWD = 4,
  }

  export enum WatchCase { 
    _WATCH_NOT_SET = 0,
    WATCH = 8,
  }
}

export class RestartStrategy extends jspb.Message {
  getNever(): NeverRestart | undefined;
  setNever(value?: NeverRestart): RestartStrategy;
  hasNever(): boolean;
  clearNever(): RestartStrategy;

  getAlways(): AlwaysRestart | undefined;
  setAlways(value?: AlwaysRestart): RestartStrategy;
  hasAlways(): boolean;
  clearAlways(): RestartStrategy;

  getExponential(): ExponentialRestart | undefined;
  setExponential(value?: ExponentialRestart): RestartStrategy;
  hasExponential(): boolean;
  clearExponential(): RestartStrategy;

  getFixed(): FixedRestart | undefined;
  setFixed(value?: FixedRestart): RestartStrategy;
  hasFixed(): boolean;
  clearFixed(): RestartStrategy;

  getRestartStrategyKindCase(): RestartStrategy.RestartStrategyKindCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestartStrategy.AsObject;
  static toObject(includeInstance: boolean, msg: RestartStrategy): RestartStrategy.AsObject;
  static serializeBinaryToWriter(message: RestartStrategy, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestartStrategy;
  static deserializeBinaryFromReader(message: RestartStrategy, reader: jspb.BinaryReader): RestartStrategy;
}

export namespace RestartStrategy {
  export type AsObject = {
    never?: NeverRestart.AsObject,
    always?: AlwaysRestart.AsObject,
    exponential?: ExponentialRestart.AsObject,
    fixed?: FixedRestart.AsObject,
  }

  export enum RestartStrategyKindCase { 
    RESTART_STRATEGY_KIND_NOT_SET = 0,
    NEVER = 1,
    ALWAYS = 2,
    EXPONENTIAL = 3,
    FIXED = 4,
  }
}

export class NeverRestart extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NeverRestart.AsObject;
  static toObject(includeInstance: boolean, msg: NeverRestart): NeverRestart.AsObject;
  static serializeBinaryToWriter(message: NeverRestart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NeverRestart;
  static deserializeBinaryFromReader(message: NeverRestart, reader: jspb.BinaryReader): NeverRestart;
}

export namespace NeverRestart {
  export type AsObject = {
  }
}

export class AlwaysRestart extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AlwaysRestart.AsObject;
  static toObject(includeInstance: boolean, msg: AlwaysRestart): AlwaysRestart.AsObject;
  static serializeBinaryToWriter(message: AlwaysRestart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AlwaysRestart;
  static deserializeBinaryFromReader(message: AlwaysRestart, reader: jspb.BinaryReader): AlwaysRestart;
}

export namespace AlwaysRestart {
  export type AsObject = {
  }
}

export class ExponentialRestart extends jspb.Message {
  getInitialDelay(): number;
  setInitialDelay(value: number): ExponentialRestart;

  getMaxDelay(): number;
  setMaxDelay(value: number): ExponentialRestart;

  getMultiplier(): number;
  setMultiplier(value: number): ExponentialRestart;

  getMaxRestarts(): number;
  setMaxRestarts(value: number): ExponentialRestart;
  hasMaxRestarts(): boolean;
  clearMaxRestarts(): ExponentialRestart;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExponentialRestart.AsObject;
  static toObject(includeInstance: boolean, msg: ExponentialRestart): ExponentialRestart.AsObject;
  static serializeBinaryToWriter(message: ExponentialRestart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExponentialRestart;
  static deserializeBinaryFromReader(message: ExponentialRestart, reader: jspb.BinaryReader): ExponentialRestart;
}

export namespace ExponentialRestart {
  export type AsObject = {
    initialDelay: number,
    maxDelay: number,
    multiplier: number,
    maxRestarts?: number,
  }

  export enum MaxRestartsCase { 
    _MAX_RESTARTS_NOT_SET = 0,
    MAX_RESTARTS = 4,
  }
}

export class FixedRestart extends jspb.Message {
  getDelay(): number;
  setDelay(value: number): FixedRestart;

  getMaxRestarts(): number;
  setMaxRestarts(value: number): FixedRestart;
  hasMaxRestarts(): boolean;
  clearMaxRestarts(): FixedRestart;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FixedRestart.AsObject;
  static toObject(includeInstance: boolean, msg: FixedRestart): FixedRestart.AsObject;
  static serializeBinaryToWriter(message: FixedRestart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FixedRestart;
  static deserializeBinaryFromReader(message: FixedRestart, reader: jspb.BinaryReader): FixedRestart;
}

export namespace FixedRestart {
  export type AsObject = {
    delay: number,
    maxRestarts?: number,
  }

  export enum MaxRestartsCase { 
    _MAX_RESTARTS_NOT_SET = 0,
    MAX_RESTARTS = 2,
  }
}

