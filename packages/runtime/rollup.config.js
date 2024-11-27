import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default {
  input: "dist/src/index.js",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  // external: ["@runy-build/schema", "execa", "vscode-jsonrpc", "winston"],
  // plugins: [json(), resolve({ preferBuiltins: true }), commonjs()],
};
