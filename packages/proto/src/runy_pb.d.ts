import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as process_pb from './process_pb'; // proto import: "process.proto"


export class SignalRequest extends jspb.Message {
  getWorkspace(): string;
  setWorkspace(value: string): SignalRequest;

  getResource(): string;
  setResource(value: string): SignalRequest;

  getSignal(): string;
  setSignal(value: string): SignalRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SignalRequest): SignalRequest.AsObject;
  static serializeBinaryToWriter(message: SignalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignalRequest;
  static deserializeBinaryFromReader(message: SignalRequest, reader: jspb.BinaryReader): SignalRequest;
}

export namespace SignalRequest {
  export type AsObject = {
    workspace: string,
    resource: string,
    signal: string,
  }
}

export class SignalResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SignalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SignalResponse): SignalResponse.AsObject;
  static serializeBinaryToWriter(message: SignalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SignalResponse;
  static deserializeBinaryFromReader(message: SignalResponse, reader: jspb.BinaryReader): SignalResponse;
}

export namespace SignalResponse {
  export type AsObject = {
  }
}

export class WorkspaceCreateRequest extends jspb.Message {
  getWorkspace(): WorkspaceMetadata | undefined;
  setWorkspace(value?: WorkspaceMetadata): WorkspaceCreateRequest;
  hasWorkspace(): boolean;
  clearWorkspace(): WorkspaceCreateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceCreateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceCreateRequest): WorkspaceCreateRequest.AsObject;
  static serializeBinaryToWriter(message: WorkspaceCreateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceCreateRequest;
  static deserializeBinaryFromReader(message: WorkspaceCreateRequest, reader: jspb.BinaryReader): WorkspaceCreateRequest;
}

export namespace WorkspaceCreateRequest {
  export type AsObject = {
    workspace?: WorkspaceMetadata.AsObject,
  }
}

export class WorkspaceCreateResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceCreateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceCreateResponse): WorkspaceCreateResponse.AsObject;
  static serializeBinaryToWriter(message: WorkspaceCreateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceCreateResponse;
  static deserializeBinaryFromReader(message: WorkspaceCreateResponse, reader: jspb.BinaryReader): WorkspaceCreateResponse;
}

export namespace WorkspaceCreateResponse {
  export type AsObject = {
  }
}

export class WorkspaceRemoveRequest extends jspb.Message {
  getName(): string;
  setName(value: string): WorkspaceRemoveRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceRemoveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceRemoveRequest): WorkspaceRemoveRequest.AsObject;
  static serializeBinaryToWriter(message: WorkspaceRemoveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceRemoveRequest;
  static deserializeBinaryFromReader(message: WorkspaceRemoveRequest, reader: jspb.BinaryReader): WorkspaceRemoveRequest;
}

export namespace WorkspaceRemoveRequest {
  export type AsObject = {
    name: string,
  }
}

export class WorkspaceRemoveResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceRemoveResponse.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceRemoveResponse): WorkspaceRemoveResponse.AsObject;
  static serializeBinaryToWriter(message: WorkspaceRemoveResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceRemoveResponse;
  static deserializeBinaryFromReader(message: WorkspaceRemoveResponse, reader: jspb.BinaryReader): WorkspaceRemoveResponse;
}

export namespace WorkspaceRemoveResponse {
  export type AsObject = {
  }
}

export class WorkspaceMetadata extends jspb.Message {
  getName(): string;
  setName(value: string): WorkspaceMetadata;

  getCwd(): string;
  setCwd(value: string): WorkspaceMetadata;
  hasCwd(): boolean;
  clearCwd(): WorkspaceMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WorkspaceMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: WorkspaceMetadata): WorkspaceMetadata.AsObject;
  static serializeBinaryToWriter(message: WorkspaceMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WorkspaceMetadata;
  static deserializeBinaryFromReader(message: WorkspaceMetadata, reader: jspb.BinaryReader): WorkspaceMetadata;
}

export namespace WorkspaceMetadata {
  export type AsObject = {
    name: string,
    cwd?: string,
  }

  export enum CwdCase { 
    _CWD_NOT_SET = 0,
    CWD = 2,
  }
}

export class JournalEntriesRequest extends jspb.Message {
  getJournal(): string;
  setJournal(value: string): JournalEntriesRequest;

  getRangesList(): Array<Range>;
  setRangesList(value: Array<Range>): JournalEntriesRequest;
  clearRangesList(): JournalEntriesRequest;
  addRanges(value?: Range, index?: number): Range;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JournalEntriesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JournalEntriesRequest): JournalEntriesRequest.AsObject;
  static serializeBinaryToWriter(message: JournalEntriesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JournalEntriesRequest;
  static deserializeBinaryFromReader(message: JournalEntriesRequest, reader: jspb.BinaryReader): JournalEntriesRequest;
}

export namespace JournalEntriesRequest {
  export type AsObject = {
    journal: string,
    rangesList: Array<Range.AsObject>,
  }
}

export class Range extends jspb.Message {
  getStart(): number;
  setStart(value: number): Range;

  getEnd(): number;
  setEnd(value: number): Range;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Range.AsObject;
  static toObject(includeInstance: boolean, msg: Range): Range.AsObject;
  static serializeBinaryToWriter(message: Range, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Range;
  static deserializeBinaryFromReader(message: Range, reader: jspb.BinaryReader): Range;
}

export namespace Range {
  export type AsObject = {
    start: number,
    end: number,
  }
}

export class JournalEntriesResponse extends jspb.Message {
  getEntriesMap(): jspb.Map<number, JournalEntry>;
  clearEntriesMap(): JournalEntriesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JournalEntriesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: JournalEntriesResponse): JournalEntriesResponse.AsObject;
  static serializeBinaryToWriter(message: JournalEntriesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JournalEntriesResponse;
  static deserializeBinaryFromReader(message: JournalEntriesResponse, reader: jspb.BinaryReader): JournalEntriesResponse;
}

export namespace JournalEntriesResponse {
  export type AsObject = {
    entriesMap: Array<[number, JournalEntry.AsObject]>,
  }
}

export class JournalEntry extends jspb.Message {
  getTs(): number;
  setTs(value: number): JournalEntry;

  getLevel(): number;
  setLevel(value: number): JournalEntry;

  getWorkspace(): string;
  setWorkspace(value: string): JournalEntry;
  hasWorkspace(): boolean;
  clearWorkspace(): JournalEntry;

  getService(): string;
  setService(value: string): JournalEntry;
  hasService(): boolean;
  clearService(): JournalEntry;

  getMessage(): string;
  setMessage(value: string): JournalEntry;
  hasMessage(): boolean;
  clearMessage(): JournalEntry;

  getFields(): Uint8Array | string;
  getFields_asU8(): Uint8Array;
  getFields_asB64(): string;
  setFields(value: Uint8Array | string): JournalEntry;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JournalEntry.AsObject;
  static toObject(includeInstance: boolean, msg: JournalEntry): JournalEntry.AsObject;
  static serializeBinaryToWriter(message: JournalEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JournalEntry;
  static deserializeBinaryFromReader(message: JournalEntry, reader: jspb.BinaryReader): JournalEntry;
}

export namespace JournalEntry {
  export type AsObject = {
    ts: number,
    level: number,
    workspace?: string,
    service?: string,
    message?: string,
    fields: Uint8Array | string,
  }

  export enum WorkspaceCase { 
    _WORKSPACE_NOT_SET = 0,
    WORKSPACE = 3,
  }

  export enum ServiceCase { 
    _SERVICE_NOT_SET = 0,
    SERVICE = 4,
  }

  export enum MessageCase { 
    _MESSAGE_NOT_SET = 0,
    MESSAGE = 5,
  }
}

export class JournalRequest extends jspb.Message {
  getWorkspace(): string;
  setWorkspace(value: string): JournalRequest;

  getService(): string;
  setService(value: string): JournalRequest;
  hasService(): boolean;
  clearService(): JournalRequest;

  getQuery(): string;
  setQuery(value: string): JournalRequest;
  hasQuery(): boolean;
  clearQuery(): JournalRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JournalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JournalRequest): JournalRequest.AsObject;
  static serializeBinaryToWriter(message: JournalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JournalRequest;
  static deserializeBinaryFromReader(message: JournalRequest, reader: jspb.BinaryReader): JournalRequest;
}

export namespace JournalRequest {
  export type AsObject = {
    workspace: string,
    service?: string,
    query?: string,
  }

  export enum ServiceCase { 
    _SERVICE_NOT_SET = 0,
    SERVICE = 2,
  }

  export enum QueryCase { 
    _QUERY_NOT_SET = 0,
    QUERY = 3,
  }
}

export class JournalRecord extends jspb.Message {
  getUuid(): string;
  setUuid(value: string): JournalRecord;

  getLength(): number;
  setLength(value: number): JournalRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JournalRecord.AsObject;
  static toObject(includeInstance: boolean, msg: JournalRecord): JournalRecord.AsObject;
  static serializeBinaryToWriter(message: JournalRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JournalRecord;
  static deserializeBinaryFromReader(message: JournalRecord, reader: jspb.BinaryReader): JournalRecord;
}

export namespace JournalRecord {
  export type AsObject = {
    uuid: string,
    length: number,
  }
}

export class TreeRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TreeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TreeRequest): TreeRequest.AsObject;
  static serializeBinaryToWriter(message: TreeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TreeRequest;
  static deserializeBinaryFromReader(message: TreeRequest, reader: jspb.BinaryReader): TreeRequest;
}

export namespace TreeRequest {
  export type AsObject = {
  }
}

export class TreeResponse extends jspb.Message {
  getWorkspacesList(): Array<TreeWorkspace>;
  setWorkspacesList(value: Array<TreeWorkspace>): TreeResponse;
  clearWorkspacesList(): TreeResponse;
  addWorkspaces(value?: TreeWorkspace, index?: number): TreeWorkspace;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TreeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TreeResponse): TreeResponse.AsObject;
  static serializeBinaryToWriter(message: TreeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TreeResponse;
  static deserializeBinaryFromReader(message: TreeResponse, reader: jspb.BinaryReader): TreeResponse;
}

export namespace TreeResponse {
  export type AsObject = {
    workspacesList: Array<TreeWorkspace.AsObject>,
  }
}

export class TreeWorkspace extends jspb.Message {
  getName(): string;
  setName(value: string): TreeWorkspace;

  getProcessesList(): Array<TreeProcess>;
  setProcessesList(value: Array<TreeProcess>): TreeWorkspace;
  clearProcessesList(): TreeWorkspace;
  addProcesses(value?: TreeProcess, index?: number): TreeProcess;

  getServicesList(): Array<TreeService>;
  setServicesList(value: Array<TreeService>): TreeWorkspace;
  clearServicesList(): TreeWorkspace;
  addServices(value?: TreeService, index?: number): TreeService;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TreeWorkspace.AsObject;
  static toObject(includeInstance: boolean, msg: TreeWorkspace): TreeWorkspace.AsObject;
  static serializeBinaryToWriter(message: TreeWorkspace, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TreeWorkspace;
  static deserializeBinaryFromReader(message: TreeWorkspace, reader: jspb.BinaryReader): TreeWorkspace;
}

export namespace TreeWorkspace {
  export type AsObject = {
    name: string,
    processesList: Array<TreeProcess.AsObject>,
    servicesList: Array<TreeService.AsObject>,
  }
}

export class TreeService extends jspb.Message {
  getName(): string;
  setName(value: string): TreeService;

  getFlags(): number;
  setFlags(value: number): TreeService;

  getProcessesList(): Array<TreeProcess>;
  setProcessesList(value: Array<TreeProcess>): TreeService;
  clearProcessesList(): TreeService;
  addProcesses(value?: TreeProcess, index?: number): TreeProcess;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TreeService.AsObject;
  static toObject(includeInstance: boolean, msg: TreeService): TreeService.AsObject;
  static serializeBinaryToWriter(message: TreeService, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TreeService;
  static deserializeBinaryFromReader(message: TreeService, reader: jspb.BinaryReader): TreeService;
}

export namespace TreeService {
  export type AsObject = {
    name: string,
    flags: number,
    processesList: Array<TreeProcess.AsObject>,
  }
}

export class TreeProcess extends jspb.Message {
  getName(): string;
  setName(value: string): TreeProcess;

  getPid(): number;
  setPid(value: number): TreeProcess;

  getRestartCount(): number;
  setRestartCount(value: number): TreeProcess;

  getLastRestart(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastRestart(value?: google_protobuf_timestamp_pb.Timestamp): TreeProcess;
  hasLastRestart(): boolean;
  clearLastRestart(): TreeProcess;

  getFlags(): number;
  setFlags(value: number): TreeProcess;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TreeProcess.AsObject;
  static toObject(includeInstance: boolean, msg: TreeProcess): TreeProcess.AsObject;
  static serializeBinaryToWriter(message: TreeProcess, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TreeProcess;
  static deserializeBinaryFromReader(message: TreeProcess, reader: jspb.BinaryReader): TreeProcess;
}

export namespace TreeProcess {
  export type AsObject = {
    name: string,
    pid: number,
    restartCount: number,
    lastRestart?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    flags: number,
  }

  export enum LastRestartCase { 
    _LAST_RESTART_NOT_SET = 0,
    LAST_RESTART = 4,
  }
}

export class Flag extends jspb.Message {
  getLabel(): string;
  setLabel(value: string): Flag;

  getValue(): google_protobuf_struct_pb.Value | undefined;
  setValue(value?: google_protobuf_struct_pb.Value): Flag;
  hasValue(): boolean;
  clearValue(): Flag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Flag.AsObject;
  static toObject(includeInstance: boolean, msg: Flag): Flag.AsObject;
  static serializeBinaryToWriter(message: Flag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Flag;
  static deserializeBinaryFromReader(message: Flag, reader: jspb.BinaryReader): Flag;
}

export namespace Flag {
  export type AsObject = {
    label: string,
    value?: google_protobuf_struct_pb.Value.AsObject,
  }
}

export class ExecRequest extends jspb.Message {
  getFolder(): string;
  setFolder(value: string): ExecRequest;

  getWatch(): boolean;
  setWatch(value: boolean): ExecRequest;

  getUuid(): string;
  setUuid(value: string): ExecRequest;
  hasUuid(): boolean;
  clearUuid(): ExecRequest;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): ExecRequest;
  hasExtra(): boolean;
  clearExtra(): ExecRequest;

  getStart(): StartCommand | undefined;
  setStart(value?: StartCommand): ExecRequest;
  hasStart(): boolean;
  clearStart(): ExecRequest;

  getCommandKindCase(): ExecRequest.CommandKindCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExecRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExecRequest): ExecRequest.AsObject;
  static serializeBinaryToWriter(message: ExecRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExecRequest;
  static deserializeBinaryFromReader(message: ExecRequest, reader: jspb.BinaryReader): ExecRequest;
}

export namespace ExecRequest {
  export type AsObject = {
    folder: string,
    watch: boolean,
    uuid?: string,
    extra?: Uint8Array | string,
    start?: StartCommand.AsObject,
  }

  export enum CommandKindCase { 
    COMMAND_KIND_NOT_SET = 0,
    START = 6,
  }

  export enum UuidCase { 
    _UUID_NOT_SET = 0,
    UUID = 4,
  }

  export enum ExtraCase { 
    _EXTRA_NOT_SET = 0,
    EXTRA = 5,
  }
}

export class StartCommand extends jspb.Message {
  getWorkspace(): WorkspaceMetadata | undefined;
  setWorkspace(value?: WorkspaceMetadata): StartCommand;
  hasWorkspace(): boolean;
  clearWorkspace(): StartCommand;

  getProcess(): process_pb.ProcessMetadata | undefined;
  setProcess(value?: process_pb.ProcessMetadata): StartCommand;
  hasProcess(): boolean;
  clearProcess(): StartCommand;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartCommand.AsObject;
  static toObject(includeInstance: boolean, msg: StartCommand): StartCommand.AsObject;
  static serializeBinaryToWriter(message: StartCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartCommand;
  static deserializeBinaryFromReader(message: StartCommand, reader: jspb.BinaryReader): StartCommand;
}

export namespace StartCommand {
  export type AsObject = {
    workspace?: WorkspaceMetadata.AsObject,
    process?: process_pb.ProcessMetadata.AsObject,
  }
}

export class ClearJournalRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearJournalRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ClearJournalRequest): ClearJournalRequest.AsObject;
  static serializeBinaryToWriter(message: ClearJournalRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearJournalRequest;
  static deserializeBinaryFromReader(message: ClearJournalRequest, reader: jspb.BinaryReader): ClearJournalRequest;
}

export namespace ClearJournalRequest {
  export type AsObject = {
  }
}

export class ClearJournalResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClearJournalResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ClearJournalResponse): ClearJournalResponse.AsObject;
  static serializeBinaryToWriter(message: ClearJournalResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClearJournalResponse;
  static deserializeBinaryFromReader(message: ClearJournalResponse, reader: jspb.BinaryReader): ClearJournalResponse;
}

export namespace ClearJournalResponse {
  export type AsObject = {
  }
}

export class TerminateRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TerminateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TerminateRequest): TerminateRequest.AsObject;
  static serializeBinaryToWriter(message: TerminateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TerminateRequest;
  static deserializeBinaryFromReader(message: TerminateRequest, reader: jspb.BinaryReader): TerminateRequest;
}

export namespace TerminateRequest {
  export type AsObject = {
  }
}

export class TerminateResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TerminateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TerminateResponse): TerminateResponse.AsObject;
  static serializeBinaryToWriter(message: TerminateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TerminateResponse;
  static deserializeBinaryFromReader(message: TerminateResponse, reader: jspb.BinaryReader): TerminateResponse;
}

export namespace TerminateResponse {
  export type AsObject = {
  }
}

export class VersionRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VersionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VersionRequest): VersionRequest.AsObject;
  static serializeBinaryToWriter(message: VersionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VersionRequest;
  static deserializeBinaryFromReader(message: VersionRequest, reader: jspb.BinaryReader): VersionRequest;
}

export namespace VersionRequest {
  export type AsObject = {
  }
}

export class CommandRecord extends jspb.Message {
  getMetadata(): Metadata | undefined;
  setMetadata(value?: Metadata): CommandRecord;
  hasMetadata(): boolean;
  clearMetadata(): CommandRecord;

  getLog(): LogEntry | undefined;
  setLog(value?: LogEntry): CommandRecord;
  hasLog(): boolean;
  clearLog(): CommandRecord;

  getResult(): JsonResult | undefined;
  setResult(value?: JsonResult): CommandRecord;
  hasResult(): boolean;
  clearResult(): CommandRecord;

  getBuildrecordCase(): CommandRecord.BuildrecordCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommandRecord.AsObject;
  static toObject(includeInstance: boolean, msg: CommandRecord): CommandRecord.AsObject;
  static serializeBinaryToWriter(message: CommandRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommandRecord;
  static deserializeBinaryFromReader(message: CommandRecord, reader: jspb.BinaryReader): CommandRecord;
}

export namespace CommandRecord {
  export type AsObject = {
    metadata?: Metadata.AsObject,
    log?: LogEntry.AsObject,
    result?: JsonResult.AsObject,
  }

  export enum BuildrecordCase { 
    BUILDRECORD_NOT_SET = 0,
    METADATA = 1,
    LOG = 2,
    RESULT = 3,
  }
}

export class JsonResult extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): JsonResult;

  getError(): JsonError | undefined;
  setError(value?: JsonError): JsonResult;
  hasError(): boolean;
  clearError(): JsonResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JsonResult.AsObject;
  static toObject(includeInstance: boolean, msg: JsonResult): JsonResult.AsObject;
  static serializeBinaryToWriter(message: JsonResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JsonResult;
  static deserializeBinaryFromReader(message: JsonResult, reader: jspb.BinaryReader): JsonResult;
}

export namespace JsonResult {
  export type AsObject = {
    value: Uint8Array | string,
    error?: JsonError.AsObject,
  }
}

export class JsonError extends jspb.Message {
  getCode(): string;
  setCode(value: string): JsonError;

  getMessage(): string;
  setMessage(value: string): JsonError;

  getSource(): JsonError | undefined;
  setSource(value?: JsonError): JsonError;
  hasSource(): boolean;
  clearSource(): JsonError;

  getBacktraceList(): Array<string>;
  setBacktraceList(value: Array<string>): JsonError;
  clearBacktraceList(): JsonError;
  addBacktrace(value: string, index?: number): JsonError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JsonError.AsObject;
  static toObject(includeInstance: boolean, msg: JsonError): JsonError.AsObject;
  static serializeBinaryToWriter(message: JsonError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JsonError;
  static deserializeBinaryFromReader(message: JsonError, reader: jspb.BinaryReader): JsonError;
}

export namespace JsonError {
  export type AsObject = {
    code: string,
    message: string,
    source?: JsonError.AsObject,
    backtraceList: Array<string>,
  }

  export enum SourceCase { 
    _SOURCE_NOT_SET = 0,
    SOURCE = 3,
  }
}

export class Metadata extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metadata.AsObject;
  static toObject(includeInstance: boolean, msg: Metadata): Metadata.AsObject;
  static serializeBinaryToWriter(message: Metadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metadata;
  static deserializeBinaryFromReader(message: Metadata, reader: jspb.BinaryReader): Metadata;
}

export namespace Metadata {
  export type AsObject = {
  }
}

export class LogEntry extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogEntry.AsObject;
  static toObject(includeInstance: boolean, msg: LogEntry): LogEntry.AsObject;
  static serializeBinaryToWriter(message: LogEntry, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogEntry;
  static deserializeBinaryFromReader(message: LogEntry, reader: jspb.BinaryReader): LogEntry;
}

export namespace LogEntry {
  export type AsObject = {
  }
}

export class VersionResponse extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): VersionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VersionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VersionResponse): VersionResponse.AsObject;
  static serializeBinaryToWriter(message: VersionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VersionResponse;
  static deserializeBinaryFromReader(message: VersionResponse, reader: jspb.BinaryReader): VersionResponse;
}

export namespace VersionResponse {
  export type AsObject = {
    version: string,
  }
}

