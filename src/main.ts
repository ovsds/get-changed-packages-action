import { getInput, info, setFailed, setOutput } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";
import { ChangedPackagesFormatLiteral } from "./models";

function getActionInput(): ActionInput {
  return parseActionInput({
    changedFiles: getInput("changed-files", { required: true }),
    changedFilesSeparator: getInput("changed-files-separator", { trimWhitespace: false, required: true }),
    allPackages: getInput("all-packages", { required: true }),
    allPackagesSeparator: getInput("all-packages-separator", { trimWhitespace: false, required: true }),
    changedPackagesFormat: getInput("changed-packages-format", { required: true }),
    changedPackagesListSeparator: getInput("changed-packages-list-separator", {
      trimWhitespace: false,
      required: true,
    }),
    packageDependenciesResolutionMethod: getInput("package-dependencies-resolution-method", { required: true }),
    poetryPathDependenciesGroups: getInput("poetry-path-dependencies-groups", { required: true }),
    poetryPathDependenciesGroupsSeparator: getInput("poetry-path-dependencies-groups-separator", {
      trimWhitespace: false,
      required: true,
    }),
  });
}

function setActionOutput(
  actionResult: ActionResult,
  changedPackagesFormat: ChangedPackagesFormatLiteral,
  changedPackagesListSeparator: string,
): void {
  info(`Action result: ${JSON.stringify(actionResult)}`);
  if (changedPackagesFormat === "list") {
    setOutput("changed-packages", actionResult.changedPackages.join(changedPackagesListSeparator));
  } else {
    setOutput("changed-packages", JSON.stringify(actionResult.changedPackages));
  }
}

async function _main(): Promise<void> {
  const actionInput = getActionInput();
  const actionInstance = Action.fromOptions({
    ...actionInput,
    logger: info,
  });
  const actionResult = await actionInstance.run();
  setActionOutput(actionResult, actionInput.changedPackagesFormat, actionInput.changedPackagesListSeparator);
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
