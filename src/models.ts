import { parseNonEmptyString } from "./utils/parse";

export const packageDependenciesResolutionMethods = ["none", "all", "poetry-path", "poetry-all"] as const;
export type PackageDependenciesResolutionMethodLiteral = (typeof packageDependenciesResolutionMethods)[number];
export const parsePackageDependenciesResolutionMethod = (
  value: string | undefined,
): PackageDependenciesResolutionMethodLiteral => {
  value = parseNonEmptyString(value);

  if (!packageDependenciesResolutionMethods.includes(value as PackageDependenciesResolutionMethodLiteral)) {
    throw new Error(`Invalid package dependencies resolution method: ${value}`);
  }
  return value as PackageDependenciesResolutionMethodLiteral;
};

export const changedPackagesFormats = ["list", "json"] as const;
export type ChangedPackagesFormatLiteral = (typeof changedPackagesFormats)[number];
export const parseChangedPackagesFormat = (value: string | undefined): ChangedPackagesFormatLiteral => {
  value = parseNonEmptyString(value);

  if (!changedPackagesFormats.includes(value as ChangedPackagesFormatLiteral)) {
    throw new Error(`Invalid changed packages format: ${value}`);
  }
  return value as ChangedPackagesFormatLiteral;
};
