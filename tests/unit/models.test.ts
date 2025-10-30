import { describe, it, expect } from "vitest";

import { parsePackageDependenciesResolutionMethod, parseChangedPackagesFormat } from "../../src/models";

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

describe("parseChangedPackagesFormat", () => {
  it("should return the changed packages format", () => {
    expect(parseChangedPackagesFormat("list")).toBe("list");
  });

  it("should throw an error if the changed packages format is invalid", () => {
    expect(() => parseChangedPackagesFormat("invalid")).toThrow("Invalid changed packages format: invalid");
  });
});
