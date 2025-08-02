import * as jspb from 'google-protobuf'



export class ServiceMetadata extends jspb.Message {
  getName(): string;
  setName(value: string): ServiceMetadata;

  getCwd(): string;
  setCwd(value: string): ServiceMetadata;

  getAutorun(): boolean;
  setAutorun(value: boolean): ServiceMetadata;

  getConfigsList(): Array<ServiceConfig>;
  setConfigsList(value: Array<ServiceConfig>): ServiceMetadata;
  clearConfigsList(): ServiceMetadata;
  addConfigs(value?: ServiceConfig, index?: number): ServiceConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceMetadata): ServiceMetadata.AsObject;
  static serializeBinaryToWriter(message: ServiceMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceMetadata;
  static deserializeBinaryFromReader(message: ServiceMetadata, reader: jspb.BinaryReader): ServiceMetadata;
}

export namespace ServiceMetadata {
  export type AsObject = {
    name: string,
    cwd: string,
    autorun: boolean,
    configsList: Array<ServiceConfig.AsObject>,
  }
}

export class ServiceConfig extends jspb.Message {
  getSelect(): Select | undefined;
  setSelect(value?: Select): ServiceConfig;
  hasSelect(): boolean;
  clearSelect(): ServiceConfig;

  getConfigCase(): ServiceConfig.ConfigCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServiceConfig.AsObject;
  static toObject(includeInstance: boolean, msg: ServiceConfig): ServiceConfig.AsObject;
  static serializeBinaryToWriter(message: ServiceConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServiceConfig;
  static deserializeBinaryFromReader(message: ServiceConfig, reader: jspb.BinaryReader): ServiceConfig;
}

export namespace ServiceConfig {
  export type AsObject = {
    select?: Select.AsObject,
  }

  export enum ConfigCase { 
    CONFIG_NOT_SET = 0,
    SELECT = 1,
  }
}

export class Select extends jspb.Message {
  getName(): string;
  setName(value: string): Select;

  getDefault(): string;
  setDefault(value: string): Select;

  getOptionsList(): Array<string>;
  setOptionsList(value: Array<string>): Select;
  clearOptionsList(): Select;
  addOptions(value: string, index?: number): Select;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Select.AsObject;
  static toObject(includeInstance: boolean, msg: Select): Select.AsObject;
  static serializeBinaryToWriter(message: Select, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Select;
  static deserializeBinaryFromReader(message: Select, reader: jspb.BinaryReader): Select;
}

export namespace Select {
  export type AsObject = {
    name: string,
    pb_default: string,
    optionsList: Array<string>,
  }
}

