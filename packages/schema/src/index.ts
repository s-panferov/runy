import { BuildContext } from "./context";
import { Schema, ToSchema } from "./schema";
import { getPackage, Package } from "./package";
import { BuildSpec } from "./spec";
import { SpecT, Target, type TargetT, type AnyTargetT, target } from "./target";
import { FileSet, fileset } from "./fileset";
import { Flag, flag } from "./flag";
import { File, file } from "./file";
import { registry } from "./registry";

import { z } from "zod";

import {
  COMPUTE_SYM,
  ORIGIN_MARKER,
  PARENT_MARKER,
  PROVIDE_SYM,
  REQUIRED_SYM,
  RESULT_SYM,
} from "./symbols";

import { Output, type Query } from "./output";

export {
  BuildContext,
  getPackage,
  fileset,
  BuildSpec,
  Package,
  FileSet,
  Output,
  Query,
  Flag,
  File,
  flag,
  file,
  registry,
  Schema,
  Target,
  AnyTargetT,
  target,
  z,
};

export type { SpecT, TargetT };

export type Compute = ToSchema & {
  [COMPUTE_SYM]: true;
  [RESULT_SYM]: unknown;
  [PROVIDE_SYM]: unknown;
  [REQUIRED_SYM]?: boolean;
  [PARENT_MARKER]?: Compute;
  [ORIGIN_MARKER]?: Compute;
};

export type Inputs = Record<string, Compute | Primitive | undefined>;
export type Outputs = Record<string, Compute | undefined>;

export type Primitive = string | number;

export type Provide<T> = T extends Record<
  infer K,
  Compute | Primitive | undefined
>
  ? { [V in K]: Provide<T[V]> }
  : T extends Compute
  ? Provide<T[typeof PROVIDE_SYM]>
  : T;

export type RequiredCompute = Compute & { [REQUIRED_SYM]: true };

export type Result<T extends Outputs> = RemoveNeverOrVoid<{
  [K in keyof T]: T[K] extends RequiredCompute
    ? T[K][typeof RESULT_SYM]
    : T[K] extends infer C | undefined
    ? C extends RequiredCompute
      ? C[typeof RESULT_SYM] | undefined
      : never
    : never;
}>;

export type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type IsEmptyObject<T> = keyof T extends never ? true : false;

export type RemoveNeverOrVoid<T> = RemoveNever<T> extends infer R
  ? IsEmptyObject<R> extends true
    ? Record<string, never> | void
    : R
  : never;

export type Empty = Record<string, never>;
export type Actions = Record<string, Target.Any>;

export type AnyTargetA<A extends Actions> = Target<TargetT & { Actions: A }>;

let GLOBAL_ID = 0;
export function globalId() {
  return GLOBAL_ID++;
}
