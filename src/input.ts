import { parseNonEmptyString } from "./utils/parse";

export interface RawActionInput {
  placeholder: string;
}

export interface ActionInput {
  placeholder: string;
}

export function parseActionInput(raw: RawActionInput): ActionInput {
  return {
    placeholder: parseNonEmptyString(raw.placeholder),
  };
}
