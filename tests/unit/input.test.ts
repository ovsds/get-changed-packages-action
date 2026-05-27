import fs from "fs";
import os from "os";
import path from "path";

import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { RawActionInput, parseActionInput } from "../../src/input";

const defaultRawInput = {
  changedFiles: "package1/file.ts\npackage2/file.ts",
  changedFilesFile: "",
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

  describe("changed-files-file", () => {
    let tempDir: string;

    beforeEach(() => {
      tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "input-test-"));
    });

    afterEach(() => {
      fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test("reads changed files from file when provided", () => {
      const filePath = path.join(tempDir, "changed.txt");
      fs.writeFileSync(filePath, "package3/file.ts\npackage4/file.ts");

      const result = parseActionInput(createRawInput({ changedFiles: "", changedFilesFile: filePath }));

      expect(result.changedFiles).toEqual(["package3/file.ts", "package4/file.ts"]);
    });

    test("throws when both changed-files and changed-files-file are set", () => {
      const filePath = path.join(tempDir, "changed.txt");
      fs.writeFileSync(filePath, "package3/file.ts");

      expect(() => parseActionInput(createRawInput({ changedFilesFile: filePath }))).toThrow("mutually exclusive");
    });

    test("throws when changed-files-file does not exist", () => {
      const filePath = path.join(tempDir, "missing.txt");

      expect(() => parseActionInput(createRawInput({ changedFiles: "", changedFilesFile: filePath }))).toThrow(
        /does not exist/,
      );
    });
  });
});
