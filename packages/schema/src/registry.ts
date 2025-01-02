import { Package } from "./package";

import assert from "node:assert";

export class Registry {
  packages = new Map<string, Package>();

  package(path: string) {
    assert(path != ".");

    let pkg = this.packages.get(path);
    if (!pkg) {
      pkg = new Package(path);
      this.packages.set(path, pkg);
    }

    return pkg;
  }
}

export const registry = new Registry();
