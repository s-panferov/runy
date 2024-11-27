import { parse } from "jsr:@std/yaml";
import { TextLineStream } from "https://deno.land/std@0.223.0/streams/mod.ts";
import { join } from "https://deno.land/std@0.219.0/path/mod.ts";

export interface ClientResponse<T> {
  data: T | null;
  errors: any[];
}

export interface ClientError {
  kind: "no data" | "graphql";
  errors?: any[];
}

export class RunaOptions {
  root?: string;
  binary?: string;
  daemon?: boolean | { port: number };
}

export type DaemonLog = {
  timestamp: string;
  level: "INFO";
  target: string;
  fields: {
    message: string;
  };
};

export class Runa {
  config: RunaOptions;

  root: string;
  binary: string;
  disposed: boolean = false;

  daemonProc?: Deno.ChildProcess;

  // never resolve
  daemonStatus = new Promise((_) => {});

  stderr!: ReadableStream<string>;

  async dispose() {
    this.disposed = true;
    if (this.daemonProc) {
      const proc = this.daemonProc;
      this.daemonProc = undefined;
      // proc.stdout.cancel();
      // proc.stderr.cancel();
      try {
        proc.kill();
      } catch (e) {
        console.error(e);
      }

      try {
        await this.stderr.cancel();
      } catch {
        // ignore
      }
      await proc.status;
      // await proc.stdout.cancel();
    }
  }

  async waitFor(func: (log: DaemonLog) => boolean) {
    for await (const line of this.stderr) {
      try {
        const jsonLog = JSON.parse(line);
        if (func(jsonLog)) {
          return;
        }
      } catch (e) {
        console.log(e);
        return;
      }
    }
  }

  [Symbol.dispose]() {
    this.dispose();
  }

  constructor(config: RunaOptions = {}) {
    this.config = config;
    this.root = config.root || Deno.makeTempDirSync();
    this.binary = config.binary || "/Users/stanislav/.bin/runy";

    if (typeof config.daemon == "object") {
      this.daemonProc = this.spawnDaemon(config.daemon.port);
      this.daemonStatus = this.daemonProc.status.then(() => {
        if (!this.disposed) {
          throw new Error("Daemon has been terminated");
        }
      });
    }
  }

  spawnDaemon(port: number): Deno.ChildProcess {
    try {
      Deno.removeSync(join(this.root, "runy.sqlite"), {});
    } catch {
      // ignore error
    }

    const command = new Deno.Command(this.binary, {
      args: [`--daemon-port=${port.toString()}`, "--json", "daemon", "sync"],
      cwd: this.root,
      stderr: "piped",
      stdout: "piped",
      env: {
        RUST_LOG:
          "runy_cli=info,runy_db=debug,runy_deno=debug,tower_lsp::codec=trace,tower_lsp=trace",
        RUST_BACKTRACE: "1",
        // RUSTFLAGS: "-Awarnings",
      },
    });

    const child = command.spawn();

    child.stdout.pipeTo(
      Deno.openSync(this.root + "/.runy/runy.out", {
        create: true,
        write: true,
      }).writable
    );

    const [stderrFile, stderr] = child.stderr.tee();

    stderrFile.pipeTo(
      Deno.openSync(this.root + "/.runy/runy.err", {
        create: true,
        write: true,
      }).writable
    );

    const stderrLines = stderr
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream());

    this.stderr = stderrLines;

    child.ref();
    console.log("Spawned daemon process:", child.pid);

    return child;
  }

  async query<T>(query: string): Promise<ClientResponse<T>> {
    const command = this.command("query", [query]);
    return parseOutput(await command.output());
  }

  command(cmd: string, args: string[]): Deno.Command {
    const daemonCfg = this.config.daemon;
    const daemon =
      typeof daemonCfg == "object"
        ? ["--daemon-spawn=false", "--daemon-port=" + daemonCfg.port.toString()]
        : daemonCfg === false
        ? ["--no-daemon"]
        : [];

    console.log({
      args: [...daemon, cmd, ...args],
      cwd: this.root,
      stderr: "inherit",
      stdout: "piped",
    });

    const command = new Deno.Command(this.binary, {
      args: [...daemon, cmd, ...args],
      cwd: this.root,
      stderr: "inherit",
      stdout: "piped",
    });

    return command;
  }

  async build<T>(args: string[] = []): Promise<ClientResponse<T>> {
    const command = this.command("build", args);
    return parseOutput(await command.output());
  }
}

function parseOutput<T>(output: Deno.CommandOutput) {
  let response: ClientResponse<T>;

  const decoder = new TextDecoder();
  const text = decoder.decode(output.stdout);

  try {
    response = parse(text) as typeof response;
  } catch (e) {
    response = {
      data: null,
      errors: [e.toString()],
    };
  }

  return response;
}
