import path from "path";
import { Package } from "./package";

import assert from "assert";

export class Registry {
  packages = new Map<string, Package>();

  definePackage(ref: string) {
    assert(ref != ".");

    let pkg = this.packages.get(ref);
    if (!pkg) {
      pkg = new Package(ref);
      this.packages.set(ref, pkg);
    }

    return pkg;
  }

  resolvePackage(ref: string): Package {
    let pkg = this.packages.get(ref);

    if (pkg) {
      return pkg;
    }

    if (path.extname(ref) == "") {
      ref = path.join(ref, "BUILD.ts");
    }

    pkg = this.packages.get(ref);

    if (!pkg) {
      throw new Error(`Package not found: ${ref}`);
    }

    return pkg;
  }
}

export const registry = new Registry();
