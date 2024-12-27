default: build

build:
  just -f packages/schema/Justfile
  just -f packages/runtime/Justfile
    