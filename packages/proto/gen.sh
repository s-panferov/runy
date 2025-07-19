export ROOT=$(git rev-parse --show-toplevel)

protoc -I=. process.proto \
  --plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --proto_path=$ROOT/packages/proto \
  --js_out=import_style=commonjs:src \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:src

protoc -I=. runy.proto \
  --plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --proto_path=$ROOT/packages/proto \
  --js_out=import_style=commonjs:src \
  --grpc-web_out=import_style=typescript,mode=grpcwebtext:src

protoc \
  --proto_path=$ROOT/packages/proto \
  --plugin=protoc-gen-js=./node_modules/.bin/protoc-gen-js \
  --plugin=protoc-gen-ts_proto=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=./src \
  --ts_proto_opt=importSuffix=.ts,esModuleInterop,outputServices=grpc-js \
  rpc.proto

