const path = require("path");
const rspack = require("@rspack/core");

/** @type {import('@rspack/cli').Configuration} */
const config = {
  entry: {
    index: "./src/index.ts",
  },
  mode: "development",
  externalsPresets: {
    node: true,
  },
  externals: {
    "@runy-build/schema": true,
  },
  output: {
    filename: "index.js",
  },
  experiments: {
    outputModule: true,
  },
  resolve: {
    tsConfig: {
      configFile: path.resolve(__dirname, "tsconfig.json"),
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
module.exports = config;
