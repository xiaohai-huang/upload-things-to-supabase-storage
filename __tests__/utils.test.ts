/**
 * Unit tests for src/utils.ts
 */
import { getFiles } from '../src/utils'
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
})
