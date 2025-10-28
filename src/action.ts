export interface ActionResult {
  placeholder: string;
}

interface ActionOptions {
  placeholder: string;
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

  async run(): Promise<ActionResult> {
    this.options.logger(`Running with placeholder: ${this.options.placeholder}`);

    return {
      placeholder: this.options.placeholder,
    };
  }
}
