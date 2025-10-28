export const parseNonEmptyString = (value: string | undefined): string => {
  if (!value) {
    throw new Error(`Invalid ${value}, must be a non-empty string`);
  }
  if (value.trim() === "") {
    throw new Error(`Invalid ${value}, must be a non-empty string`);
  }
  return value;
};
