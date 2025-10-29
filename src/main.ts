import { getInput, info, setFailed, setOutput } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";

function getActionInput(): ActionInput {
  return parseActionInput({
    changedFiles: getInput("changed-files", { required: true }),
    changedFilesSeparator: getInput("changed-files-separator", { trimWhitespace: false, required: true }),
    allPackages: getInput("all-packages", { required: true }),
    allPackagesSeparator: getInput("all-packages-separator", { trimWhitespace: false, required: true }),
    changedPackagesSeparator: getInput("changed-packages-separator", { trimWhitespace: false, required: true }),
    packageDependenciesResolutionMethod: getInput("package-dependencies-resolution-method", { required: true }),
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
