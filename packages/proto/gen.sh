#!/bin/bash

export ROOT=$(git rev-parse --show-toplevel)

# Proto files configuration
GRPC_WEB_PROTOS=("service.proto" "process.proto" "runy.proto")
NATIVE_GRPC_PROTOS=("service.proto" "process.proto" "rpc.proto")

# Common protoc settings
PROTO_PATH="$ROOT/packages/proto"
PLUGIN_JS="./node_modules/.bin/protoc-gen-js"
PLUGIN_TS_PROTO="./node_modules/.bin/protoc-gen-ts_proto"

# Clean existing generated code
echo "Cleaning existing generated code..."
rm -rf native/*
rm -rf web/*

# Generate grpc-web code (for web clients)
echo "Generating grpc-web code..."
mkdir -p web
for proto in "${GRPC_WEB_PROTOS[@]}"; do
  protoc -I=. "$proto" \
    --plugin=protoc-gen-js="$PLUGIN_JS" \
    --plugin=protoc-gen-ts_proto="$PLUGIN_TS_PROTO" \
    --proto_path="$PROTO_PATH" \
    --js_out=import_style=commonjs:web \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:web
done

# Generate native gRPC code (for Node.js)
echo "Generating native gRPC code..."
mkdir -p native
for proto in "${NATIVE_GRPC_PROTOS[@]}"; do
  protoc \
    --proto_path="$PROTO_PATH" \
    --plugin=protoc-gen-js="$PLUGIN_JS" \
    --plugin=protoc-gen-ts_proto="$PLUGIN_TS_PROTO" \
    --ts_proto_out=./native \
    --ts_proto_opt=importSuffix=.ts,esModuleInterop,outputServices=grpc-js \
    "$proto"
done

