# Get Changed Packages Action

[![CI](https://github.com/ovsds/get-changed-packages-action/workflows/Check%20PR/badge.svg)](https://github.com/ovsds/get-changed-packages-action/actions?query=workflow%3A%22%22Check+PR%22%22)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Get%20Changed%20Packages-blue.svg)](https://github.com/marketplace/actions/get-changed-packages)

Action to get changed packages using list of changed files.

## Usage

### Example

```yaml
jobs:
  get-changed-packages:
    permissions:
      contents: read

    steps:
      - name: Get Changed Files
        id: get-changed-files
        uses: tj-actions/changed-files@24d32ffd492484c1d75e0c0b894501ddb9d30d62
        with:
          base_sha: ${{ github.event.pull_request.base.sha }}
          sha: ${{ github.event.pull_request.head.sha }}
          separator: "\n"

      - name: Get Changed Packages
        id: get-changed-packages
        uses: ovsds/get-changed-packages-action@v1
        with:
          changed-files: ${{ steps.changed-files.outputs.all_changed_files }}
          package-directory-regex: "packages/.*/"
```

### Action Inputs

| Name                      | Description                                 | Default |
| ------------------------- | ------------------------------------------- | ------- |
| `changed-files`           | List of changed files.                      |         |
| `package-directory-regex` | Regex pattern to match package directories. |         |

### Action Outputs

| Name               | Description               |
| ------------------ | ------------------------- |
| `changed-packages` | List of changed packages. |

## Development

### Global dependencies

- [Taskfile](https://taskfile.dev/installation/)
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)
- [zizmor](https://woodruffw.github.io/zizmor/installation/) - used for GHA security scanning

### Taskfile commands

For all commands see [Taskfile](Taskfile.yaml) or `task --list-all`.

## License

[MIT](LICENSE)
