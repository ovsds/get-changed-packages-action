import { describe, it, expect } from "vitest";

import { parsePackageDependenciesResolutionMethod } from "../../src/models";

describe("parsePackageDependenciesResolutionMethod", () => {
  it("should return the package dependencies resolution method", () => {
    expect(parsePackageDependenciesResolutionMethod("none")).toBe("none");
  });

  it("should throw an error if the package dependencies resolution method is invalid", () => {
    expect(() => parsePackageDependenciesResolutionMethod("invalid")).toThrow(
      "Invalid package dependencies resolution method: invalid",
    );
  });
});
