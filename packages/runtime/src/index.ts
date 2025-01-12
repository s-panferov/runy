import { startLsp } from "./lsp/mod";

import winston from "winston";
import * as execa from "execa";

import { Builder, runtime } from "./runtime";

let __init = false;
export function init() {
  if (__init) {
    return;
  }

  __init = true;
  winston.configure({
    levels: winston.config.syslog.levels,
    format: winston.format.json(),
    transports: [
      new winston.transports.Console({
        stderrLevels: Object.keys(winston.config.syslog.levels),
      }),
    ],
  });

  startLsp();
}

if (process.env["BUILD_LSP"]) {
  init();
}

export { runtime, execa, type Builder };
