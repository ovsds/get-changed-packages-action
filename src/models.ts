import { parseNonEmptyString } from "./utils/parse";

export const packageDependenciesResolutionMethods = ["none", "all"] as const;
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
