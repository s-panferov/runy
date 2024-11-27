import { BuildFile } from "./buildfile";

export class Registry {
  buildfiles = new Map<string, BuildFile>();

  buildfile(meta: ImportMeta) {
    let buildfile = this.buildfiles.get(meta.url);
    if (!buildfile) {
      buildfile = new BuildFile(meta);
      this.buildfiles.set(meta.url, buildfile);
    }

    return buildfile;
  }
}

export const registry = new Registry();
