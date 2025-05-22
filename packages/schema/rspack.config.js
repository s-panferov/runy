import * as path from "path";
import { rspack } from "@rspack/core";

import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: {
    index: "./src/index.ts",
  },
  target: "es2022",
  mode: "development",
  externalsPresets: {
    web: true, // Don't bundle web modules
  },
  output: {
    filename: "index.js",
    chunkFormat: "module",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    tsConfig: {
      configFile: path.resolve(import.meta.dirname, "tsconfig.json"),
    },
    extensions: ["...", ".ts"],
  },
  plugins: [new NodePolyfillPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "builtin:swc-loader",
            /**
             * @type {import('@rspack/core').SwcLoaderOptions}
             */
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                },
              },
            },
          },
        ],
      },
    ],
  },
};

export default config;
