import { describe, expect, test } from "vitest";

import { Action } from "../../src/action";

describe("Action tests", () => {
  test("runs with changed files and package directory regex", async () => {
    const action = Action.fromOptions({
      changedFiles: [
        "src/package1/file.ts",
        "src/package1/file2.ts",
        "src/package1/subfolder/file.ts",
        "src/package2/file.ts",
        "other/file.ts",
        "other/src/package4/file.ts",
      ],
      allPackages: ["src/package1", "src/package2"],
      packageDependenciesResolutionMethod: "none",
      logger: console.log,
    });
    expect(await action.run()).toEqual({
      changedPackages: ["src/package1", "src/package2"],
    });
  });

  test("runs with changed files and package dependencies resolution method all", async () => {
    const action = Action.fromOptions({
      changedFiles: ["src/package1/file.ts"],
      allPackages: ["src/package1", "src/package2"],
      packageDependenciesResolutionMethod: "all",
      logger: console.log,
    });
    expect(await action.run()).toEqual({
      changedPackages: ["src/package1", "src/package2"],
    });
  });
});
