proto: 
  cp ../runy/packages/proto/*.proto packages/proto
  cd packages/proto && sh ./gen.sh

core:
  cd packages/core && pnpm exec rollup -c rollup.config.js