import { describe, expect, test } from "vitest";

import { parseNonEmptyString } from "../../../src/utils/parse";

describe("Parse utils tests", () => {
  test("parseNonEmptyString parses non-empty string correctly", () => {
    expect(parseNonEmptyString("test")).toBe("test");
  });

  test("parseNonEmptyString throws error when empty", () => {
    expect(() => parseNonEmptyString("")).toThrowError();
    expect(() => parseNonEmptyString(undefined)).toThrowError();
  });
});
