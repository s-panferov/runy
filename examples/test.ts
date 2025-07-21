#!/usr/bin/env -S bun --watch

import { workspace } from "@runy-dev/core";

const ws = workspace(import.meta);

ws.service("test", (s) => {
  s.autorun();
  s.option("port", {
    default: 8500,
    description: "Port to run the service on",
  });

  s.run(async (ctx) => {
    await ctx.process({
      alias: "server",
      cmd: "python3",
      args: ["-m", "http.server", "8500"],
    });
  });
});
