import { getPackage } from "../package";
import { setWorkspaceRoot } from "../env";
import { expect, test, describe } from "vitest";

describe("getPackage", () => {
  test("should return package for string input", () => {
    const result = getPackage("test-package");
    expect(result.path).toEqual("test-package");
  });

  test("should return root package", () => {
    setWorkspaceRoot("/a/b/c/runy-sdk");
    const result = getPackage(new URL("file:///a/b/c/runy-sdk"));
    expect(result.path).toEqual("");
  });

  test("should handle url input", () => {
    setWorkspaceRoot("/a/b/c/runy-sdk");
    const result = getPackage(
      new URL("file:///a/b/c/runy-sdk/packages/schema/src/package.ts")
    );
    expect(result.path).toEqual("packages/schema/src/package.ts");
  });

  test("should handle BUILD.ts files", () => {
    setWorkspaceRoot("/a/b/c/runy-sdk");
    const result = getPackage(
      new URL("file:///a/b/c/runy-sdk/packages/schema/src/BUILD.ts")
    );
    expect(result.path).toEqual("packages/schema/src/BUILD.ts");
  });
});
