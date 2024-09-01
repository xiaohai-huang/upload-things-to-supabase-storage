import * as core from '@actions/core'

import { uploadDirectory } from './utils'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const supabaseUrl = core.getInput('SUPABASE_PUBLIC_URL')
    const supabaseKey = core.getInput('SUPABASE_KEY')
    const bucketId = core.getInput('BUCKET')
    const sourceDir = core.getInput('SOURCE_DIR')
    const targetDir = core.getInput('TARGET_DIR')

    await uploadDirectory(
      supabaseUrl,
      supabaseKey,
      bucketId,
      sourceDir,
      targetDir
    )

    core.setOutput(
      'message',
      `Successfully uploaded the directory: ${sourceDir} to your supabase storage.`
    )
  } catch (error) {
    console.error(error)
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
