import { getInput, info, setFailed, setOutput } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";

function getActionInput(): ActionInput {
  return parseActionInput({
    changedFiles: getInput("changed-files"),
    changedFilesSeparator: getInput("changed-files-separator", { trimWhitespace: false }),
    packageDirectoryRegex: getInput("package-directory-regex"),
    changedPackagesSeparator: getInput("changed-packages-separator", { trimWhitespace: false }),
  });
}

function setActionOutput(actionResult: ActionResult, changedPackagesSeparator: string): void {
  info(`Action result: ${JSON.stringify(actionResult)}`);
  setOutput("changed-packages", actionResult.changedPackages.join(changedPackagesSeparator));
}

async function _main(): Promise<void> {
  const actionInput = getActionInput();
  const actionInstance = Action.fromOptions({
    ...actionInput,
    logger: info,
  });
  const actionResult = await actionInstance.run();
  setActionOutput(actionResult, actionInput.changedPackagesSeparator);
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
