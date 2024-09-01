import { readdir } from 'fs/promises'
import path from 'path'
import { createReadStream } from 'fs'
// @ts-expect-error This package does not have ts definitions
import { getMIMEType } from 'node-mime-types'
import { Upload } from 'tus-js-client'

export async function getFiles(directoryPath: string): Promise<string[]> {
  const files: string[] = []
  const dirents = await readdir(directoryPath, { withFileTypes: true })
  for (const dirent of dirents) {
    const filePath = path.join(directoryPath, dirent.name)
    if (dirent.isDirectory()) {
      files.push(...(await getFiles(filePath)))
    } else {
      files.push(filePath)
    }
  }

  return files.sort()
}

export function removeDirectoryPath(
  fullPath: string,
  directoryPath: string
): string {
  // Check if the fullPath starts with the directoryPath
  if (fullPath.startsWith(directoryPath)) {
    // Remove the directoryPath from the fullPath
    return fullPath.slice(directoryPath.length)
  }
  return fullPath
}

export function getMimeType(filePath: string): string {
  return getMIMEType(filePath)
}

async function uploadFile(
  supabaseUrl: string,
  supabaseKey: string,
  bucket: string,
  sourcePath: string,
  targetPath: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const file = createReadStream(sourcePath)
    const contentType = getMimeType(sourcePath)

    const upload = new Upload(file, {
      endpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      retryDelays: [0, 200, 500, 1500, 3000, 5000],
      headers: {
        authorization: `Bearer ${supabaseKey}`,
        'x-upsert': 'true' // optionally set upsert to true to overwrite existing files
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
      metadata: {
        bucketName: bucket,
        objectName: targetPath,
        contentType,
        cacheControl: '3600'
      },
      chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
      onError(error) {
        console.error(`Failed to upload ${sourcePath} because: ${error}`)
        reject(error)
      },
      onProgress(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        console.log(`Uploading ${sourcePath} ${percentage}%`)
      },
      onSuccess() {
        console.log(`Successfully uploaded ${sourcePath}`)
        resolve()
      }
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(previousUploads => {
      // Found previous uploads so we select the first one.
      if (previousUploads.length) {
        upload.resumeFromPreviousUpload(previousUploads[0])
      }

      upload.start()
    })
  })
}

export async function uploadDirectory(
  supabaseUrl: string,
  supabaseKey: string,
  bucket: string,
  sourceDirPath: string,
  targetDirPath: string
): Promise<void> {
  const files = await getFiles(sourceDirPath)
  const uploadPromises = files.map(async sourcePath => {
    const targetPath = path.join(
      targetDirPath,
      removeDirectoryPath(sourcePath, sourceDirPath)
    )

    await uploadFile(supabaseUrl, supabaseKey, bucket, sourcePath, targetPath)
  })

  await Promise.all(uploadPromises)
}
