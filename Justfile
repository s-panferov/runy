proto: 
  cd packages/proto && sh ./gen.sh

core:
  cd packages/core && pnpm exec rollup -c rollup.config.js