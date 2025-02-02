import { describe, expect, test } from "@jest/globals";
import { Output, Query } from "./output";
import { Schema } from "./schema";

describe("Output", () => {
  test("test", () => {
    let output = Output.dyn(undefined, "inp") as any as Query<{
      test: string;
    }>;

    let schema = new Schema();
    expect(schema.convert(output.test)).toStrictEqual([
      { kind: "output", name: "inp" },
      { kind: "output", name: "test" },
    ]);
  });
});
