# Get Changed Python Packages Action

[![CI](https://github.com/ovsds/get-changed-python-packages-action/workflows/Check%20PR/badge.svg)](https://github.com/ovsds/get-changed-python-packages-action/actions?query=workflow%3A%22%22Check+PR%22%22)
[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-Get%20Changed%20Python%20Packages-blue.svg)](https://github.com/marketplace/actions/get-changed-python-packages)

Get Changed Python Packages Action

## Usage

### Example

```yaml
jobs:
  get-changed-python-packages:
    permissions:
      contents: read

    steps:
      - name: Get Changed Python Packages
        id: get-changed-python-packages
        uses: ovsds/get-changed-python-packages-action@v1
```

### Action Inputs

| Name          | Description  | Default |
| ------------- | ------------ | ------- |
| `placeholder` | Placeholder. |         |

### Action Outputs

| Name          | Description  |
| ------------- | ------------ |
| `placeholder` | Placeholder. |

## Development

### Global dependencies

- [Taskfile](https://taskfile.dev/installation/)
- [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script)
- [zizmor](https://woodruffw.github.io/zizmor/installation/) - used for GHA security scanning

### Taskfile commands

For all commands see [Taskfile](Taskfile.yaml) or `task --list-all`.

## License

[MIT](LICENSE)
