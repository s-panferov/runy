import { Target, TargetT } from "../target";

declare class Runtime<S extends TargetT> {
  SPEC: S;
}

export function runtime<T extends Target<any>>(): Runtime<
  T extends Target<infer V> ? V : never
> {
  return new Runtime();
}

const rt = runtime<ReturnType<typeof import("./runtime.build").target>>();

export default rt;
