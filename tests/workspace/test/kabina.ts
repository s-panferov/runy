import "runy";

import { join } from "https://deno.land/std@0.219.0/path/mod.ts";

import {
  build,
  buildfile,
  fileset,
  flag,
  Target,
} from "../../../packages/runy-schema/src/schema/mod.ts";

const mod = buildfile(import.meta);

const pnpm = mod.target("pnpm", (ctx) => {
  const files = fileset(["package.json", "package-lock.json"]);
  return build({
    in: { files },
    out: {
      bin: ctx.data<{ tsc: string; parcel: string }>(),
      lockfile: ctx.outFile("package-lock.json"),
    },
  });
});

pnpm.exec = async (ctx, { files }) => {
  await ctx.log("DIRNAME " + ctx.cwd);
  await ctx.run([
    "pnpm",
    "install",
    "--config.modules-dir=.pnpm",
    "--ignore-workspace",
  ]);

  await ctx.log("Hello from `a` " + JSON.stringify(files));

  // throw new Error
  return {
    bin: {
      tsc: "./.pnpm/.bin/tsc",
      parcel: "./.pnpm/.bin/parcel",
    },
    lockfile: "package.lock",
  };
};

const ts_lib = mod.target("ts_lib", (ctx) => {
  const tsc = pnpm.out(ctx).bin.tsc;
  const files = fileset(["src/**/*"]);
  return build({
    in: { files, tsc },
    out: {
      out: ctx.outFolder("out"),
    },
  });
});

ts_lib.exec = async (ctx, { files, tsc }) => {
  await ctx.log("Hello from `a` " + JSON.stringify(files));
  await ctx.run([tsc, "--build"]);

  // throw new Error
  return {
    out: "out",
  };
};

const buildType = flag(
  import.meta,
  Symbol("buildType"),
  flag.string(["release", "debug"])
);

const someFlag = flag(import.meta, Symbol("someFlag"), flag.string(["a", "b"]));

const bundle = mod.target("test", (ctx) => {
  const out = ts_lib.out(ctx).out;
  const bin = pnpm.out(ctx).bin;
  const parcel = bin.parcel;
  return build({
    key: [],
    in: { out, parcel, someFlag },
    out: {
      bundle: ctx.outFile("dist/index.js"),
    },
  });
});

Target.exec(bundle, async (ctx, { out, parcel, someFlag: _ }) => {
  await ctx.log(
    "Hello from `test`. Data: " +
      JSON.stringify([parcel, "build", join(out, "index.js")])
  );

  await ctx.run([parcel, "build", join(out, "index.js")]);

  return {
    bundle: "dist/index.js",
  };
});

const server = mod.target("server", (ctx) => {
  return build({
    in: {},
    out: {},
    ready: {
      port: ctx.data<number>(),
    },
  });
});

server.exec = async (ctx) => {
  await ctx.log("Running server...");
  const server = Deno.serve(
    {
      port: 8000,
      hostname: "0.0.0.0",
      signal: ctx.signal,
      onListen: () => {
        ctx.ready({
          port: 8000,
        });
      },
    },
    (_req) => {
      return new Response("Hello, World!");
    }
  );

  await server.finished;
  return {};
};

const bundleRun = mod.target("bundle.run", (ctx) => {
  return build({
    key: [],
    in: {
      bundle: bundle.out(ctx).bundle,
      port: server.ready(ctx).port,
    },
    out: {},
  });
});

bundleRun.exec = async (ctx, { bundle, port }) => {
  ctx.log("Running node on port..." + port + bundle);

  const server = Deno.serve(
    {
      port: 8001,
      hostname: "0.0.0.0",
      signal: ctx.signal,
      onListen: () => {
        ctx.ready({
          port: 8001,
        });
      },
    },
    (_req) => {
      return new Response(bundle);
    }
  );

  await server.finished;
  return {};
};

Target.action(bundle, "run", bundleRun);
bundle.actions.run;

// const bundleRunner = Target.public(import.meta, function test(ctx) {
//   return build({ bundle: bundle.in(ctx) }, {
//     exitCode: ctx.data<number>(),
//   });
// });

// Target.exec(bundleRunner, async (ctx, {}) => {
//   ctx.run([]);
//   return {};
// });

// const bundleRunner = ;

// Target.runner(bundleRunner, async ({ bundle }) => {
//   // ctx.run([bundle])
// });

// bundle.runner = Target.define(import.meta, (ctx) => {
//   pnpm.in(ctx); // extra dependencies that should be built or running
//   return build({}, {
//     bundle: bundle.in(ctx),
//   });
// });

// console.log(
//   JSON.stringify(Schema.convert(bundle.in(new BuildContext())), null, 4),
// );

import { withDaemon as _withDaemon } from "runy/test/mod.ts";

const DAEMON = { root: import.meta.dirname, daemon: { port: 3010 } };
const env = _withDaemon.bind(null, DAEMON);

Deno.test(
  "build bundle",
  env(async (daemon) => {
    const result = await daemon.build(["test"]);
    console.log(result);

    await daemon.waitFor((a) => {
      return a.fields.message == "Build task completed";
    });
  })
);

Deno.test(
  "bundle.run",
  env(async (daemon) => {
    const first = daemon.command("build", ["bundle.run"]).spawn();

    await new Promise((r) => setTimeout(r, 3000));
    const second = daemon.command("build", ["bundle.run"]).spawn();

    setTimeout(() => {
      console.log("Killing the second command");
      second.kill();
    }, 5000);

    await second.status;

    setTimeout(() => {
      console.log("Killing the first command");
      first.kill();
    }, 5000);

    await first.status;

    await new Promise((r) => setTimeout(r, 5000));
  })
);
