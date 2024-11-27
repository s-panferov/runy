import objectHash from "object-hash";

export function hash(obj: object): string {
  return objectHash(obj, {
    encoding: "base64",
    respectFunctionProperties: false,
    respectType: false,
    unorderedObjects: true,
  });
}
