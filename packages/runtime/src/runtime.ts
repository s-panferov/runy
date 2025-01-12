import { Provide, Result, SpecT, Target, TargetT } from "@runy-build/schema";
import { BuildAPI } from "./api";

export let BUILDER: Builder<TargetT> | undefined;

export type Builder<T extends SpecT> = (
  ctx: BuildAPI<T>,
  inputs: Provide<T["In"] & T["InOut"]>,
  outputs: Provide<T["Out"] & T["InOut"]>,
  ready: Provide<T["Ready"]>
) => Promise<Result<T["Out"]>>;

export class Runtime<T extends TargetT> {
  SPEC!: TargetT;
}

export function runtime<T extends Target<any>>(
  builder: Builder<T extends Target<infer V> ? V : never>
): Runtime<T extends Target<infer V> ? V : never> {
  BUILDER = builder as any;
  return new Runtime();
}
