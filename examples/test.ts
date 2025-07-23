#!/usr/bin/env -S bun --watch

import { workspace } from "@runy-dev/core";

const ws = workspace(import.meta);

ws.service("test", (s) => {
  s.autorun();

  s.run(async (ctx) => {
    await ctx.process({
      alias: "server",
      cmd: "python3",
      restart: {
        kind: "fixed",
        delay: 1000,
        maxRestarts: 5,
      },
      args: ["-m", "http.server", "8500"],
    });
  });
});
