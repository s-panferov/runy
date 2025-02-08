import { BuildContext, Schema } from "../index";
import { setWorkspaceRoot } from "../env";
import { expect, test, describe } from "vitest";

import { target } from "./runtime.build";

describe("runtime input", () => {
  test("runtime input", () => {
    setWorkspaceRoot(import.meta.url);

    const schema = Schema.convert(target().out(new BuildContext()));
    console.log(schema);

    expect(schema).toMatchSnapshot();
  });
});
