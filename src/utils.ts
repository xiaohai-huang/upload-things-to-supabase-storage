import { exec } from 'child_process'
import { readdir } from 'fs/promises'
import { promisify } from 'util'
import path from 'path'

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

const execPromise = promisify(exec)

export async function getMimeType(filePath: string) {
  const { stdout: mimetype, stderr } = await execPromise(
    `file --brief --mime-type ${filePath}`
  )
  if (stderr)
    throw new Error(`Unable to get the mine type of ${filePath}. ${stderr}`)
  return mimetype.trimEnd()
}
