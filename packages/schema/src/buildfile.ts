import { Flag, Target } from "./index";

import { BuildSpecFactory } from "./spec";
import { registry } from "./registry";
import { SpecT } from "./target";
import { WORKSPACE_ROOT } from "./env";

import path from "node:path";

export class BuildFile {
  meta: ImportMeta;

  targets = new Map<string, Target.Any>();
  flags = new Map<string, Flag<symbol, any>>();

  #defaultTarget?: Target.Any;

  constructor(meta: ImportMeta) {
    this.meta = meta;
  }

  target<const T extends SpecT>(
    name: string,
    func: BuildSpecFactory<T>
  ): Target<T & { Actions: {} }> {
    return new Target(this, name, func as any);
  }

  flag<const K extends symbol, const T extends flag.FlagType<any>>(
    meta: ImportMeta,
    symbol: K,
    ty: T
  ): Flag<K, T> {
    const flag = new Flag<K, T>(meta, symbol, ty);
    this.flags.set(symbol.description!, flag);
    return flag;
  }

  input<const T extends SpecT>(
    name: string,
    func: BuildSpecFactory<T>
  ): Target<T & { Actions: {} }> {
    return new Target(this, name, func as any);
  }

  get urlPath() {
    const url = new URL(this.meta.url);
    if (url.protocol === "file:") {
      const filePath = decodeURIComponent(url.pathname);
      if (WORKSPACE_ROOT) {
        return path.relative(WORKSPACE_ROOT, filePath);
      }
      // If BUILD_ROOT is not set, return the absolute file path
      return filePath;
    }
    // If it's not a file URL, return the original URL
    return this.meta.url;
  }

  get defaultTarget(): Target.Any | undefined {
    return this.#defaultTarget;
  }

  default<T extends Target<any>>(target: T) {
    if (this.#defaultTarget) {
      this.#defaultTarget.default = false;
    }

    target.default = true;
    this.#defaultTarget = target;
  }

  exportTarget(target: Target.Any) {
    const exists = this.targets.get(target.name);
    if (exists) {
      throw new Error(
        `Duplicated target: "${target.name}" in ${target.buildfile}`
      );
    }

    this.targets.set(target.name, target);
  }

  exportFlag(flag: Flag<symbol, any>) {
    const name = flag.key.description || "<flag>";
    const exists = this.flags.get(name);
    if (exists) {
      throw new Error(`Duplicated flag: "${name}" in ${flag.buildfile}`);
    }

    this.flags.set(name, flag);
  }
}

export function buildfile(meta: ImportMeta): BuildFile {
  return registry.buildfile(meta);
}
