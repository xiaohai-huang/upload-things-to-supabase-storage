/**
 * Unit tests for src/utils.ts
 */
import path from 'path'
import { getFiles, removeDirectoryPath, getMimeType } from '../src/utils'
import { expect } from '@jest/globals'

describe('utils.ts', () => {
  it('get files in  .github', async () => {
    const dir = '.github'
    const files = await getFiles(dir)
    expect(files).toEqual([
      '.github/dependabot.yml',
      '.github/linters/.eslintrc.yml',
      '.github/linters/.markdown-lint.yml',
      '.github/linters/.yaml-lint.yml',
      '.github/linters/tsconfig.json',
      '.github/workflows/check-dist.yml',
      '.github/workflows/ci.yml',
      '.github/workflows/codeql-analysis.yml',
      '.github/workflows/linter.yml'
    ])
  })

  it('remove directory path', () => {
    expect(removeDirectoryPath('.github/dependabot.yml', '.github')).toEqual(
      '/dependabot.yml'
    )

    expect(
      removeDirectoryPath('build/WebGL/index.html', 'build/WebGL')
    ).toEqual('/index.html')

    expect(
      removeDirectoryPath('build/WebGL/Build/data.br', 'build/WebGL')
    ).toEqual('/Build/data.br')
  })

  it('generate remote path for index.html', () => {
    const localDir = 'build/WebGL'
    const filePath = 'build/WebGL/index.html'
    const supabasePath = 'games/GTA5'
    const remotePath = path.join(
      supabasePath,
      removeDirectoryPath(filePath, localDir)
    )

    expect(remotePath).toEqual('games/GTA5/index.html')
  })

  it('generate remote path for Build/data.br', () => {
    const localDir = 'build/WebGL'
    const filePath = 'build/WebGL/Build/data.br'
    const supabasePath = 'games/GTA5'
    const remotePath = path.join(
      supabasePath,
      removeDirectoryPath(filePath, localDir)
    )

    expect(remotePath).toEqual('games/GTA5/Build/data.br')
  })

  it('mime types of .github', async () => {
    expect(getMimeType('.github/dependabot.yml')).toEqual('text/yaml')
    expect(getMimeType('.github/linters/tsconfig.json')).toEqual(
      'application/json'
    )
    expect(getMimeType('badges/coverage.svg')).toEqual('image/svg+xml')
    expect(getMimeType('hello.css')).toEqual('text/css')
  })
})
