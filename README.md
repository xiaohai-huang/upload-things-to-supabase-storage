# Supabase Upload Github Action

[![GitHub Super-Linter](https://github.com/actions/typescript-action/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/actions/typescript-action/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Upload files to Supabase Storage.

It uses `tus-js-client` to upload files.

## Usage

Put the following step in your workflow

```yaml
- name: Upload to Supabase Storage
  uses: xiaohai-huang/upload-things-to-supabase-storage
  with:
    SUPABASE_PUBLIC_URL: ${{ secrets.SUPABASE_PUBLIC_URL }}
    SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
    BUCKET: websites
    SOURCE_DIR: build/WebGL
    TARGET_DIR: games/GTA5
```

The following concrete example shows how this action uploads files to the remote
storage.

```bash
# SOURCE_DIR: ls
- build/WebGL/index.html
- build/WebGL/logo.png
- build/WebGL/Build/data.br
- build/WebGL/Build/code.wsam.br

# TARGET_DIR: ls
- games/GTA5/index.html
- games/GTA5/logo.png
- games/GTA5/Build/data.br
- games/GTA5/Build/code.wsam.br
```
