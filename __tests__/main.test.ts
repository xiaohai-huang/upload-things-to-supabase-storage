/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let debugMock: jest.SpiedFunction<typeof core.debug>
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    debugMock = jest.spyOn(core, 'debug').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  // it('upload the dist folder', async () => {
  //   // Set the action's inputs as return values from core.getInput()
  //   getInputMock.mockImplementation(name => {
  //     switch (name) {
  //       case 'SUPABASE_PUBLIC_URL':
  //         return 'https://supabase.cc'
  //       case 'SUPABASE_KEY':
  //         return 'xxx'
  //       case 'BUCKET':
  //         return 'websites'
  //       case 'SOURCE_DIR':
  //         return 'dist'
  //       case 'TARGET_DIR':
  //         return 'test-01/hello-mate'
  //       default:
  //         return ''
  //     }
  //   })

  //   await main.run()
  //   expect(runMock).toHaveReturned()
  //   expect(setOutputMock).toHaveBeenCalledWith(
  //     'message',
  //     `Successfully uploaded the directory: dist to your supabase storage.`
  //   )
  //   expect(setFailedMock).not.toHaveBeenCalled()
  //   expect(errorMock).not.toHaveBeenCalled()
  // })

  it('I do not know how to test supabase upload', () => {})
})
