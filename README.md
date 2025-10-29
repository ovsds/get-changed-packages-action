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
          all-packages: src/packages/*
          package-dependencies-resolution-method: poetry-path
```

### Action Inputs

```yaml
inputs:
  changed-files:
    description: |
      List of changed files.
    required: true
  changed-files-separator:
    description: |
      Separator to split changed files.
    required: true
    default: "\n"
  all-packages:
    description: |
      List of all packages in the project.
    required: true
  all-packages-separator:
    description: |
      Separator to split all packages.
    required: true
    default: "\n"
  changed-packages-separator:
    description: |
      Separator to split changed packages.
    required: true
    default: "\n"
  package-dependencies-resolution-method:
    description: |
      Method to resolve package dependencies. Possible values:
        - `none` - no dependencies resolution
        - `all` - all packages are considered changed
        - `poetry-path` - dependencies are resolved using path dependencies from `pyproject.toml`
    required: true
    default: "none"
  poetry-path-dependencies-groups:
    description: |
      Used only if `package-dependencies-resolution-method` is `poetry-path`.
      Groups of dependencies to use as depencencies for poetry-path resolution method.
    required: true
    default: "tool.poetry.dependencies"
  poetry-path-dependencies-groups-separator:
    description: |
      Used only if `package-dependencies-resolution-method` is `poetry-path`.
      Separator to split poetry-path dependencies groups.
    required: true
    default: "\n"
```

### Action Outputs

```yaml
outputs:
  changed-packages:
    description: |
      List of changed packages.
```

## Development

### Global dependencies

- [Taskfile](https://taskfile.dev/installation/)
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)
- [zizmor](https://woodruffw.github.io/zizmor/installation/) - used for GHA security scanning

### Taskfile commands

For all commands see [Taskfile](Taskfile.yaml) or `task --list-all`.

## License

[MIT](LICENSE)
