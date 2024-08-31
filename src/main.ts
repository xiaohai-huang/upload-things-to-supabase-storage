import * as core from '@actions/core'
import path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

import { getFiles, getMimeType, removeDirectoryPath } from './utils'
import { readFile } from 'fs/promises'

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
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function uploadFileToSupabase(
  supabase: SupabaseClient,
  bucket: string,
  filePath: string,
  targetPath: string
): Promise<void> {
  const file = await readFile(filePath)
  const contentType = await getMimeType(filePath)
  const { error } = await supabase.storage
    .from(bucket)
    .upload(targetPath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType
    })

  if (error) {
    throw new Error(`Failed to upload ${targetPath}: ${error.message}`)
  } else {
    console.log(`Successfully uploaded ${targetPath}`)
  }
}

async function uploadDirectory(
  supabase: SupabaseClient,
  directoryPath: string,
  bucket: string,
  supabasePath: string
): Promise<void> {
  const files = await getFiles(directoryPath)
  const uploadPromises = files.map(async filePath => {
    const remotePath = path.join(
      supabasePath,
      removeDirectoryPath(filePath, directoryPath)
    )

    await uploadFileToSupabase(supabase, bucket, filePath, remotePath)
  })

  await Promise.all(uploadPromises)
}
