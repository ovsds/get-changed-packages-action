export const parseNonEmptyString = (value: string | undefined): string => {
  if (value === undefined || value === "") {
    throw new Error(`Invalid ${value}, must be a non-empty string`);
  }
  return value;
};

export const parseListOfStrings = (value: string | undefined, separator: string): string[] => {
  if (value === undefined || value === "") {
    return [];
  }
  return value.split(separator);
};

export const parseRegex = (value: string | undefined): RegExp => {
  if (value === undefined || value === "") {
    throw new Error(`Invalid ${value}, must be a valid regex`);
  }
  try {
    return new RegExp(value);
  } catch (error) {
    throw new Error(`Invalid ${value}, must be a valid regex`);
  }
};

export const parseBoolean = (value: string | undefined): boolean => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`Invalid ${value}, must be "true" or "false"`);
};
