import path from "path";

import { describe, expect, test } from "vitest";

import { Action, ActionOptions } from "../../src/action";
import { PackageDependenciesResolutionMethodLiteral } from "../../src/models";

const projectRootPath = path.resolve(__dirname, "../..");
const poetryPathDefaultDataPath = path.join(projectRootPath, "tests/data/poetry-path/default");
const poetryPathNonDefaultGroupDataPath = path.join(projectRootPath, "tests/data/poetry-path/non-default-group");
const poetryPathCircularDataPath = path.join(projectRootPath, "tests/data/poetry-path/circular");

const defaultActionOptions = {
  changedFiles: [
    path.join(projectRootPath, "src/package1/file.ts"),
    path.join(projectRootPath, "src/package1/file2.ts"),
    path.join(projectRootPath, "src/package1/subfolder/file.ts"),
    path.join(projectRootPath, "src/package2/file.ts"),
    path.join(projectRootPath, "other/file.ts"),
    path.join(projectRootPath, "other/src/package4/file.ts"),
  ],
  allPackages: [path.join(projectRootPath, "src/package1"), path.join(projectRootPath, "src/package2")],
  packageDependenciesResolutionMethod: "none" as PackageDependenciesResolutionMethodLiteral,
  poetryPathDependenciesGroups: ["tool.poetry.dependencies"],
  logger: console.log,
};

function createActionOptions(overrides: Partial<ActionOptions> = {}): ActionOptions {
  return {
    ...defaultActionOptions,
    ...overrides,
  };
}

describe("Action tests", () => {
  test("runs with default options", async () => {
    const action = Action.fromOptions(createActionOptions());
    expect(await action.run()).toEqual({
      changedPackages: [path.join(projectRootPath, "src/package1"), path.join(projectRootPath, "src/package2")],
    });
  });

  test("runs with method: all", async () => {
    const action = Action.fromOptions(
      createActionOptions({
        packageDependenciesResolutionMethod: "all",
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(projectRootPath, "src/package1"), path.join(projectRootPath, "src/package2")],
    });
  });

  test("runs with method: poetry-path", async () => {
    const dataPath = poetryPathDefaultDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(dataPath, "parent/file.ts")],
        allPackages: [
          path.join(dataPath, "parent"),
          path.join(dataPath, "child"),
          path.join(dataPath, "grandchild"),
          path.join(dataPath, "independent"),
        ],
        packageDependenciesResolutionMethod: "poetry-path",
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(dataPath, "parent"), path.join(dataPath, "child"), path.join(dataPath, "grandchild")],
    });
  });

  test("runs with method: poetry-path and relative paths", async () => {
    const absoluteDataPath = poetryPathDefaultDataPath;
    const relativeDataPath = path.relative(projectRootPath, absoluteDataPath);

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(relativeDataPath, "parent/file.ts")],
        allPackages: [
          path.join(relativeDataPath, "parent"),
          path.join(relativeDataPath, "child"),
          path.join(relativeDataPath, "grandchild"),
          path.join(relativeDataPath, "independent"),
        ],
        packageDependenciesResolutionMethod: "poetry-path",
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [
        path.join(absoluteDataPath, "parent"),
        path.join(absoluteDataPath, "child"),
        path.join(absoluteDataPath, "grandchild"),
      ],
    });
  });

  test("runs with method: poetry-path and non default group", async () => {
    const dataPath = poetryPathNonDefaultGroupDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(dataPath, "parent/file.ts")],
        allPackages: [path.join(dataPath, "parent"), path.join(dataPath, "child1"), path.join(dataPath, "child2")],
        packageDependenciesResolutionMethod: "poetry-path",
        poetryPathDependenciesGroups: [
          "tool.poetry.group.group1.dependencies",
          "tool.poetry.group.group2.dependencies",
        ],
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(dataPath, "parent"), path.join(dataPath, "child1"), path.join(dataPath, "child2")],
    });
  });

  test("runs with method: poetry-path and circular dependencies", async () => {
    const dataPath = poetryPathCircularDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(dataPath, "package1/file.ts")],
        allPackages: [path.join(dataPath, "package1"), path.join(dataPath, "package2")],
        packageDependenciesResolutionMethod: "poetry-path",
      }),
    );

    expect(await action.run()).toEqual({
      changedPackages: [path.join(dataPath, "package1"), path.join(dataPath, "package2")],
    });
  });
});
