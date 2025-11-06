import { getInput, info, warning, setFailed, setOutput, startGroup, endGroup } from "@actions/core";

import { Action, ActionResult } from "./action";
import { ActionInput, parseActionInput } from "./input";
import { ChangedPackagesFormatLiteral } from "./models";

function getActionInput(): ActionInput {
  return parseActionInput({
    changedFiles: getInput("changed-files", { required: false }),
    changedFilesSeparator: getInput("changed-files-separator", { trimWhitespace: false, required: true }),
    allPackages: getInput("all-packages", { required: true }),
    allPackagesSeparator: getInput("all-packages-separator", { trimWhitespace: false, required: true }),
    changedPackagesFormat: getInput("changed-packages-format", { required: true }),
    changedPackagesRelativePath: getInput("changed-packages-relative-path", { required: true }),
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
    rootPath: process.cwd(),
    logger: {
      info: info,
      warning: warning,
      startGroup: startGroup,
      endGroup: endGroup,
    },
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
