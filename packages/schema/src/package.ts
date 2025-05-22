import { flag, Flag, Target } from "./index";

import { BuildSpecFactory } from "./spec";
import { registry } from "./registry";
import { SpecT } from "./target";
import { WORKSPACE_ROOT } from "./env";

import path from "path";

export class Package {
  constructor(path: string) {
    this.path = path;
  }

  targets = new Map<string, Target.Any>();
  flags = new Map<string, Flag<symbol, any>>();
  path: string;

  #defaultTarget?: Target.Any;

  target<const T extends SpecT>(
    name: string,
    func: BuildSpecFactory<T>
  ): Target<T & { Actions: {} }> {
    return new Target(this, name, func as any);
  }

  flag<const K extends symbol, const T extends flag.FlagType<any>>(
    symbol: K,
    ty: T
  ): Flag<K, T> {
    const flag = new Flag<K, T>(this, symbol, ty);
    this.flags.set(symbol.description!, flag);
    return flag;
  }

  input<const T extends SpecT>(
    name: string,
    func: BuildSpecFactory<T>
  ): Target<T & { Actions: {} }> {
    return new Target(this, name, func as any);
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
        `Duplicated target: "${target.name}" in ${target.package}`
      );
    }

    this.targets.set(target.name, target);
  }

  exportFlag(flag: Flag<symbol, any>) {
    const name = flag.key.description || "<flag>";
    const exists = this.flags.get(name);
    if (exists) {
      throw new Error(`Duplicated flag: "${name}" in ${flag.package}`);
    }

    this.flags.set(name, flag);
  }
}

export function getPackage(meta: ImportMeta | URL | string): Package {
  if (typeof meta === "string") {
    return registry.definePackage(meta);
  }

  let urlStr = "url" in meta ? meta.url : meta;
  const url = new URL(urlStr);

  let pkg = "";

  const filePath = decodeURIComponent(url.pathname);

  if (WORKSPACE_ROOT) {
    pkg = path.relative(WORKSPACE_ROOT, filePath);
  } else {
    // If BUILD_ROOT is not set, use the absolute file path
    pkg = filePath;
  }

  if (pkg.startsWith("./")) {
    pkg = pkg.slice(2);
  }

  if (pkg == ".") {
    pkg = "";
  }

  return registry.definePackage(pkg);
}
