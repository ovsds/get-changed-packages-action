import { describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  changedFiles: "test_changed_file\ntest_changed_file_2",
  changedFilesSeparator: "\n",
  packageDirectoryRegex: ".*",
  changedPackagesSeparator: "\n",
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
      changedFiles: ["test_changed_file", "test_changed_file_2"],
      packageDirectoryRegex: new RegExp(".*"),
      changedPackagesSeparator: "\n",
    });
  });

  test("empty changed files returns empty array", () => {
    expect(parseActionInput(createRawInput({ changedFiles: "" }))).toEqual({
      changedFiles: [],
      packageDirectoryRegex: new RegExp(".*"),
      changedPackagesSeparator: "\n",
    });
  });

  test("empty package directory regex throws error", () => {
    expect(() => parseActionInput(createRawInput({ packageDirectoryRegex: "" }))).toThrowError();
  });
});
