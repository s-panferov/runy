import * as path from "path";
import { rspack } from "@rspack/core";

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: {
    index: "./src/index.ts",
  },
  mode: "development",
  externalsPresets: {
    node: true,
  },
  output: {
    filename: "index.js",
    chunkFormat: "module",
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
