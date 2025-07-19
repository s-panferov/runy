export default {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    [
      "@semantic-release/exec",
      {
        // prepareCmd: "runy build",
        // publishCmd: "pnpm run publish-packages",
      },
    ],
    "semantic-release-pnpm",
  ],
  monorepo: {
    packageFiles: ["packages/*/package.json"],
    tagFormat: "${name}@${version}",
  },
  npmPublish: true,
};
