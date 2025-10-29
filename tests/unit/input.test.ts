import { describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  changedFiles: "package1/file.ts\npackage2/file.ts",
  changedFilesSeparator: "\n",
  allPackages: "package1\npackage2",
  allPackagesSeparator: "\n",
  changedPackagesSeparator: "\n",
  packageDependenciesResolutionMethod: "none",
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
      changedFiles: ["package1/file.ts", "package2/file.ts"],
      allPackages: ["package1", "package2"],
      changedPackagesSeparator: "\n",
      packageDependenciesResolutionMethod: "none",
    });
  });

  test("empty changed files returns empty array", () => {
    expect(parseActionInput(createRawInput({ changedFiles: "" }))).toEqual({
      changedFiles: [],
      allPackages: ["package1", "package2"],
      changedPackagesSeparator: "\n",
      packageDependenciesResolutionMethod: "none",
    });
  });

  test("invalid package dependencies resolution method throws error", () => {
    expect(() => parseActionInput(createRawInput({ packageDependenciesResolutionMethod: "invalid" }))).toThrowError();
  });
});
