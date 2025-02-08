import objectHash from "object-hash";

export function hash(obj: object): string {
  return objectHash(obj, {
    encoding: "base64",
    respectFunctionProperties: false,
    respectFunctionNames: false,
    ignoreUnknown: true,
    respectType: false,
    unorderedObjects: true,
  });
}
