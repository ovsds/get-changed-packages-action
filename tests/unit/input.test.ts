import { describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  changedFiles: "package1/file.ts\npackage2/file.ts",
  changedFilesSeparator: "\n",
  allPackages: "package1\npackage2",
  allPackagesSeparator: "\n",
  changedPackagesFormat: "list",
  changedPackagesRelativePath: "false",
  changedPackagesListSeparator: "\n",
  packageDependenciesResolutionMethod: "none",
  poetryPathDependenciesGroups: "group1\ngroup2",
  poetryPathDependenciesGroupsSeparator: "\n",
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
      changedPackagesFormat: "list",
      changedPackagesRelativePath: false,
      changedPackagesListSeparator: "\n",
      packageDependenciesResolutionMethod: "none",
      poetryPathDependenciesGroups: ["group1", "group2"],
    });
  });
});
