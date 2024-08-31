import { readdir } from 'fs/promises'
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
