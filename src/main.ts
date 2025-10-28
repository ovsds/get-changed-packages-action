import { getInput, info, setFailed, setOutput } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";

function getActionInput(): ActionInput {
  return parseActionInput({
    placeholder: getInput("placeholder"),
  });
}

function setActionOutput(actionResult: ActionResult): void {
  info(`Action result: ${JSON.stringify(actionResult)}`);
  setOutput("placeholder", actionResult.placeholder);
}

async function _main(): Promise<void> {
  const actionInput = getActionInput();
  const actionInstance = Action.fromOptions({
    ...actionInput,
    logger: info,
  });
  const actionResult = await actionInstance.run();
  setActionOutput(actionResult);
}

async function main(): Promise<void> {
  try {
    _main();
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      setFailed("An unexpected error occurred");
    }
  }
}

main();
