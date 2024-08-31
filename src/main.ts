import * as core from '@actions/core'
import path from 'path'
import { readFile } from 'fs/promises'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { getFiles } from './utils'

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

    const supabase = createClient(supabaseUrl, supabaseKey)
    await uploadDirectory(supabase, sourceDir, bucketId, targetDir)

    core.setOutput(
      'message',
      `Successfully uploaded the directory: ${sourceDir} to your supabase storage.`
    )
  } catch (error: any) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function uploadFileToSupabase(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  fileContent: Buffer
) {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, fileContent, { cacheControl: '3600', upsert: true })
  if (error) {
    throw new Error(`Failed to upload ${path}: ${error.message}`)
  } else {
    core.debug(`Successfully uploaded ${path}`)
  }
}

async function uploadDirectory(
  supabase: SupabaseClient,
  directoryPath: string,
  bucket: string,
  supabasePath: string
) {
  const files = await getFiles(directoryPath)
  const uploadPromises = files.map(async filePath => {
    const content = await readFile(filePath)
    // remove the local folder name
    const parts = filePath.split(path.sep)
    parts.shift()
    const remotePath = path.join(supabasePath, ...parts)
    await uploadFileToSupabase(supabase, bucket, remotePath, content)
  })

  await Promise.all(uploadPromises)
}
