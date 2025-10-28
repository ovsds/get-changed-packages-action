import { describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  placeholder: "test_placeholder",
};

function createRawInput(overrides: Partial<RawActionInput> = {}): RawActionInput {
  return {
    ...defaultRawInput,
    ...overrides,
  };
}

describe("Input tests", () => {
  test("parses raw input correctly", () => {
    expect(parseActionInput(createRawInput())).toEqual({
      placeholder: "test_placeholder",
    });
  });

  test("throws error when placeholder is empty", () => {
    expect(() => parseActionInput(createRawInput({ placeholder: "" })).placeholder).toThrowError();
  });
});
