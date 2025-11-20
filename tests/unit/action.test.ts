import path from "path";

import { describe, expect, test } from "vitest";

import { Action, ActionOptions } from "../../src/action";
import { PackageDependenciesResolutionMethodLiteral } from "../../src/models";

const projectRootPath = path.resolve(__dirname, "../..");
const defaultDataPath = path.join(projectRootPath, "tests/data/default");
const poetryPathDefaultDataPath = path.join(projectRootPath, "tests/data/poetry-path/default");
const poetryPathNonDefaultGroupDataPath = path.join(projectRootPath, "tests/data/poetry-path/non-default-group");
const poetryPathCircularDataPath = path.join(projectRootPath, "tests/data/poetry-path/circular");

const defaultActionOptions = {
  changedFiles: [
    path.join(defaultDataPath, "src/package1/file.ts"),
    path.join(defaultDataPath, "src/package2/subfolder/file.ts"),
    path.join(defaultDataPath, "other/package4/file.ts"),
    path.join(defaultDataPath, "other/package5/file.ts"),
  ],
  allPackages: [path.join(defaultDataPath, "src/*")],
  changedPackagesRelativePath: false,
  packageDependenciesResolutionMethod: "none" as PackageDependenciesResolutionMethodLiteral,
  poetryPathDependenciesGroups: ["tool.poetry.dependencies"],
  rootPath: defaultDataPath,
  logger: {
    info: console.log,
    warning: (message: string) => console.log(`[WARNING] ${message}`),
    startGroup: (message: string) => console.log(`[START GROUP] ${message}`),
    endGroup: () => console.log(`[END GROUP]`),
  },
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
      changedPackages: [path.join(defaultDataPath, "src/package1"), path.join(defaultDataPath, "src/package2")],
    });
  });

  test("runs with glob for allPackages", async () => {
    const action = Action.fromOptions(
      createActionOptions({
        allPackages: [path.join(defaultDataPath, "src/*")],
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(defaultDataPath, "src/package1"), path.join(defaultDataPath, "src/package2")],
    });
  });

  test("runs with relative paths", async () => {
    const absoluteDataPath = defaultDataPath;
    const relativeDataPath = path.relative(projectRootPath, absoluteDataPath);

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [
          path.join(relativeDataPath, "src/package1/file.ts"),
          path.join(relativeDataPath, "src/package2/subfolder/file.ts"),
          path.join(relativeDataPath, "other/package4/file.ts"),
          path.join(relativeDataPath, "other/package5/file.ts"),
        ],
        allPackages: [path.join(relativeDataPath, "src/*")],
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(absoluteDataPath, "src/package1"), path.join(absoluteDataPath, "src/package2")],
    });
  });

  test("runs with changedPackagesRelativePath: true", async () => {
    const action = Action.fromOptions(
      createActionOptions({
        changedPackagesRelativePath: true,
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: ["src/package1", "src/package2"],
    });
  });

  test("runs with method: all", async () => {
    const action = Action.fromOptions(
      createActionOptions({
        packageDependenciesResolutionMethod: "all",
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [
        path.join(defaultDataPath, "src/package1"),
        path.join(defaultDataPath, "src/package2"),
        path.join(defaultDataPath, "src/package3"),
      ],
    });
  });

  test("runs with method: poetry-path", async () => {
    const dataPath = poetryPathDefaultDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(dataPath, "parent/file.ts"), path.join(dataPath, "non_package/file")],
        allPackages: [path.join(dataPath, "*")],
        packageDependenciesResolutionMethod: "poetry-path",
        rootPath: dataPath,
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [path.join(dataPath, "parent"), path.join(dataPath, "child"), path.join(dataPath, "grandchild")],
    });
  });

  test("runs with method: poetry-path and non default group", async () => {
    const dataPath = poetryPathNonDefaultGroupDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [path.join(dataPath, "parent/file.ts")],
        allPackages: [path.join(dataPath, "*")],
        packageDependenciesResolutionMethod: "poetry-path",
        poetryPathDependenciesGroups: [
          "tool.poetry.group.group1.dependencies",
          "tool.poetry.group.group2.dependencies",
        ],
        rootPath: dataPath,
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
        allPackages: [path.join(dataPath, "*")],
        packageDependenciesResolutionMethod: "poetry-path",
        rootPath: dataPath,
      }),
    );

    expect(await action.run()).toEqual({
      changedPackages: [path.join(dataPath, "package1"), path.join(dataPath, "package2")],
    });
  });

  test("runs with method: poetry-path and no changed packages", async () => {
    const dataPath = poetryPathDefaultDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        changedFiles: [],
        allPackages: [path.join(dataPath, "parent")],
        packageDependenciesResolutionMethod: "poetry-path",
        rootPath: dataPath,
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [],
    });
  });

  test("runs with method: poetry-all", async () => {
    const dataPath = poetryPathDefaultDataPath;

    const action = Action.fromOptions(
      createActionOptions({
        allPackages: [path.join(dataPath, "*")],
        packageDependenciesResolutionMethod: "poetry-all",
        rootPath: dataPath,
      }),
    );
    expect(await action.run()).toEqual({
      changedPackages: [
        path.join(dataPath, "child"),
        path.join(dataPath, "grandchild"),
        path.join(dataPath, "independent"),
        path.join(dataPath, "parent"),
      ],
    });
  });
});
