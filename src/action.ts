export interface ActionResult {
  changedPackages: string[];
}

interface ActionOptions {
  changedFiles: string[];
  packageDirectoryRegex: RegExp;
  logger: (message: string) => void;
}

export class Action {
  static fromOptions(actionOptions: ActionOptions): Action {
    return new Action(actionOptions);
  }

  private readonly options: ActionOptions;

  constructor(actionOptions: ActionOptions) {
    this.options = actionOptions;
  }

  getChangedPackages(changedFiles: string[], packageDirectoryRegex: RegExp): string[] {
    return Array.from(
      new Set(
        changedFiles
          .map((file) => {
            const match = file.match(packageDirectoryRegex);
            return match ? match[0] : null;
          })
          .filter((directory) => directory !== null),
      ),
    );
  }

  async run(): Promise<ActionResult> {
    const changedPackages = this.getChangedPackages(this.options.changedFiles, this.options.packageDirectoryRegex);

    this.options.logger(`Found ${changedPackages.length} changed packages:`);
    this.options.logger(changedPackages.join("\n"));

    return {
      changedPackages,
    };
  }
}
