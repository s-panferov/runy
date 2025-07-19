import swc from "@rollup/plugin-swc";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "esm",
  },
  plugins: [swc()],
};
