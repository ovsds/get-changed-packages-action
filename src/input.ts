import { parseListOfStrings, parseNonEmptyString, parseRegex } from "./utils/parse";

export interface RawActionInput {
  changedFiles: string;
  changedFilesSeparator: string;
  packageDirectoryRegex: string;
  changedPackagesSeparator: string;
}

export interface ActionInput {
  changedFiles: string[];
  packageDirectoryRegex: RegExp;
  changedPackagesSeparator: string;
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  const changedFilesSeparator = parseNonEmptyString(raw.changedFilesSeparator);

  return {
    changedFiles: parseListOfStrings(raw.changedFiles, changedFilesSeparator),
    packageDirectoryRegex: parseRegex(raw.packageDirectoryRegex),
    changedPackagesSeparator: parseNonEmptyString(raw.changedPackagesSeparator),
  };
}
